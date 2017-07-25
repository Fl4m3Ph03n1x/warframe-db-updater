                                    yyyyyyyyyyyyyyyyyyyyyyyosysosyyyyyyyyyyyyyyyyyyyyy
                                    yyyyyyyyyyyyyyyyyyyyy+` +yo``/yyyyyyyyyyyyyyyyyyyy
                                    yyyyyyyyyyyyyyyyyyys-   --:   .oyyyyyyyyyyyyyyyyyy
                                    yyyyyyyyyyyyyyyyys/`            :syyyyyyyyyyyyyyyy
                                    yyyyyyyyyyyyyyyy+.     .+so-     `+yyyyyyyyyyyyyyy
                                    yyyyyyyyyyyyyys-     .+/.y-:+-     .oyyyyyyyyyyyyy
                                    yyyyyyyyyyyyy/     `++`  y.  /o-     :syyyyyyyyyyy
                                    yyyyyyyyyyyo`    `/o.  -/o+-  `+/`    `+yyyyyyyyyy
                                    yyyyyyyyyo-     :s:  `:. o../.  -o/`    .oyyyyyyyy
                                    yyyyyyys/`    -o/`  -- -oys: ./`  /s/     :syyyyyy
                                    yyyyyyo`    .oo.  -- .+s-`.oo. -:  `+s.    `+yyyyy
                                    yyyyyys.     -+:` :-`-os` `os/ `:` -/-     `oyyyyy
                                    yyyyyyyy:   ` `/y+` ::`oysys..-``/s+` `   .syyyyyy
                                    yyyyyyyyy/   -. -yy/ -o.yyy::: :sy: `-   /yyyyyyyy
                                    yyyyyyyyyyo` -o `syyo.osyyyss`+yyy- +:  /yyyyyyyyy
                                    yyyyyyyyyy:  :s` +yy+o/yyyyyo+/yys `o+  -yyyyyyyyy
                                    yyyyyyyyyo   +yy+-/y/ /yyyyy+.-y+-/sys   +yyyyyyyy
                                    yyyyyyyyys.  +yyyyoos  -yyy:  +soyyyys  `syyyyyyyy
                                    yyyyyyyyyyo  -yyyyyyy. `yyy- `syyyyyy:  +yyyyyyyyy
                                    yyyyyyyyyyy:  syyyyyy/ `yyy- -yyyyyyy` -yyyyyyyyyy
                                    yyyyyyyyyyys. /yyyyyys `yyy- +yyyyyyo `syyyyyyyyyy
                                    yyyyyyyyyyyys`.syyyyyy-`yyy-`yyyyyyy- oyyyyyyyyyyy
                                    yyyyyyyyyyyyys.:yyyyyy+`yyy--yyyyyy/`oyyyyyyyyyyyy
                                    yyyyyyyyyyyyyyy//yyyyyy.yyy-oyyyyyo:yyyyyyyyyyyyyy
                                    yyyyyyyyyyyyyyyyyyyyyyyoyyy+syyyyyyyyyyyyyyyyyyyyy


Deprecated 
--------

This project is no longer being mantained. Feel free to fork it and do with it as
you will.
    
Description
----------
Also known as the Wikia-stalker, `warframe-db-updater` is a project which 
purpose is to scavenge the warframe wikia looking for news and updates and to 
save those changes in a database, freely accessible via the misery-api project.

Current Features
-----------------
Currently this project extracts data for the following mod types:

 - Warframes


Currently, the stalker does **not** provide information about:

 - Archwings
 - Archwing Melee
 - Archwing Rifles
 - Syndicate Mods
 - Rivens
  - Rifles
 - Shotguns
 - Pistols
 - Melee 
 - Sentinels
 - Kubrows
 - Kavats
 - Sentinels
 - Auras
 - Stances

Further versions of the stalker are planned to improve on this, but since the 
project stalks the Wikia, it is imperative to improve the wikia's quality first.

Why use rely on wikia stalker?
------------------------
Because the wikia api is lackluster, offers inconsisten and incopmplete 
information, and usually you never know what you are going to get. 

This happens becasue the data provided by the wikia api is generated 
automatically, and the articles need to have a specific format, for it to work. 
Consequently, most users don't know how to write articles specificly for the wikia
api, and so it does not work.

Wikia stalker, fixes that. By studying the overall templates of each page, and 
scrapping it, wikia stalker is able to build a json object with all the 
information you need. 

Further more, wikia stalker enforces the following:

 - Data Consistency: entries regarding the same entity will have the same 
information
 - Data Uniformity: all entries use the same units for the same information 
 - Data Validity: all entries in the DB will conform to a certain schema
 - Partial Data Accuracy: Any entry is sure to describe an entity, and any entry 
field is sure to exist

Wikia Stalker **cannot enforce**:

 - Total Data Accuracy: making sure that all the entries are not fake and are 
accurate representation of the real world. Since the wikia is not troll proof, 
and since this service relies on it, I cannot ensure that all the entries in the
database will be 100% accurate. At best, I can ensure that if the service
has an entry, that entry will be in the wikia and it will be as accurate as it 
is there.

 - Data completness: no missing entries (mods) for the supported mod types. If 
the wikia does not have an item, this service won't have it either. If the wikia
is not complete, this service won't be either. Furthermore, even if the wikia is
complete, this service will only provide a subset of all the entries in the wikia, 
which is the subset of consistent, valid and uniform data.

If an item violates any of the above data guidelines, it will be considered not
valid and it will not be available via the misery-api, nor in the project's 
database.

How to get the data?
-------------------
You can access all the current data on `server\extracted_info`. The files 
ending in `*_mods.json` contain an overview of all the mods of that category. 

For example, `warframe_mods.json` has an overview and basic information about 
all the warframe mods. 

The files ending in `*_mods_info.json` contain detailed information about all 
the mods of that category. 

Please note that these files are guidelines of intented progress, and that their
validity is not yet enforced.

How to use the misery-api?
-----------------------
More information on this coming soon :P

Licensing and documentation
--------------------------

This project is under the [GPL license](https://en.wikipedia.org/wiki/GNU_General_Public_License), 
 and it's code is publicly [documented](https://fl4m3ph03n1x.github.io/warframe-db-updater/) as well.

