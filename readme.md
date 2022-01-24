# Gigaset LDAP Addressbook

This little script represents a ldap service for Gigaset DECT Bases to provide an addressbook with mysql as a data source.

## Configuration & Startup

Rename config.example.js to config.js and change the values as needed. Start the Service with `node index.js` or run it as a docker container. You can also add a mysql server in the docker-compose.

## Gigaset

In Gigaset you have to configure this server as an LDAP Source in "Online-Telefonbücher" -> "Firmen".

|Key|Value|
|-----|------|
|Telefonbuchname|Any name|
|Serveradresse|Hostname where this service is hosted|
|Serverport|`1389`|
|LDAP-Suchbasis|`dc=domain,dc=de`|
|Benutzername|`cn=gigaset,dc=domain,dc=de`|
|Kennwort|`changeme`|
|Sicheres LDAP|`Kein`|

|Key|Value|
|-----|------|
|Namensfilter|`(|(name=*%*)(sn=%)(givenname=%))`|
|Nummernfilter|`(|(office=%)(mobile=%))`|
|Zusätzlicher Filter #1 Name||
|Zusätzlicher Filterwert #1 Wert||
|Zusätzlicher Filter #2 Name||
|Zusätzlicher Filterwert #2 Wert||
|Anzeigeformat|`%name %ou`|

|Key|Value|
|----|----|
|Vorname|`givenname`|
|Nachname|`sn`|
|Telefon (Privat)||
|Telefon (Büro)|`office`|
|Telefon (Mobil)|`mobile`|
|E-Mail|`mail`|
|Fax|`fax`|
|Firma|`ou`|
|Straße|`streetAddress`|
|Stadt|`city`|
|Zip|`postalCode`|
|Land||
|Zusätzliches Attribut||

