const ldap = require("ldapjs");
const mysql = require("mysql");
const server = ldap.createServer();
const config = require("./config.js");

const data = { [config.basedn]: { objectclass: ["top", "domain", "domainDNS"] } };

const requestAddressbook = async () => {
    console.log("Refreshing phone book");

    const db = mysql.createConnection(config.database);

    db.connect();

    db.query("SELECT * FROM phonebook", (err, contacts) => {
        if (err) {
            console.log("Error refreshing phone book", err);
            return;
        } else {
            console.log("Found", contacts.length, "contacts in database");
        }

        for (const contact of contacts) {
            let p = contact.Name.indexOf(" ");
            if (p != -1) contact.surname = contact.Name.substr(0, p);
            p = contact.Name.lastIndexOf(" ");
            if (p != -1) contact.firstname = contact.Name.substr(p + 1);
            if (contact.Mobile || contact.Office) {
                if (!data["ou=" + contact.Typ + "," + config.basedn]) {
                    data["ou=" + contact.Typ + "," + config.basedn] = {
                        objectclass: ["top", "organizationalUnit"],
                    };
                }
                data["cn=" + contact.Id + ",ou=" + contact.Typ + "," + config.basedn] = {
                    objectclass: ["user", "top", "person", "organizationalPerson"],
                    cn: contact.Id,
                    mail: contact.Email,
                    givenname: contact.firstname,
                    name: contact.Name,
                    sn: contact.surname,
                    ou: contact.Organization,
                    office: contact.Office,
                    fax: contact.Fax,
                    mobile: contact.Mobile,
                    city: contact.City,
                    postalCode: contact.PostalCode,
                    streetAddress: contact.Address,
                };
            }
        }

        console.log("Stored", Object.keys(data).length, "contacts in memory");
    });

    db.end();
};

requestAddressbook();

setInterval(() => {
    requestAddressbook();
}, 60 * 60 * 1000);

server.bind(config.basedn, (req, res, next) => {
    const dn = req.dn.toString().replace(/\s/g, "");
    if (dn === config.username && req.credentials === config.password) {
        res.end();
        return next();
    } else {
        return next(new ldap.InvalidCredentialsError());
    }
});

server.search(config.basedn, (req, res, next) => {
    const dn = req.dn.toString().replace(/\s/g, "");

    //if (req.scope === "base") {
    console.log("Requesting", req.scope, dn, data[dn]);
    //}

    if (!data[dn]) return next(new ldap.NoSuchObjectError(dn));
    let scopeCheck;

    switch (req.scope) {
        case "base":
            if (req.filter.matches(data[dn])) {
                console.log("sending b", dn);
                res.send({
                    dn: dn,
                    attributes: data[dn],
                });
            }
            res.end();
            return next();

        case "one":
            scopeCheck = (k) => {
                if (req.dn.equals(k)) return true;
                const parent = ldap.parseDN(k).parent();
                return parent ? parent.equals(req.dn) : false;
            };
            break;

        case "sub":
            scopeCheck = (k) => {
                return req.dn.equals(k) || req.dn.parentOf(k);
            };
            break;
    }

    const keys = Object.keys(data);
    for (const key of keys) {
        if (!scopeCheck(key)) return;
        if (req.filter.matches(data[key])) {
            console.log("sending l", key);
            res.send({
                dn: key,
                attributes: data[key],
            });
        }
    }

    res.end();
    return next();
});

server.listen(config.port, () => {
    console.log("Gigaset Addressbookserver started at %s", server.url);
});
