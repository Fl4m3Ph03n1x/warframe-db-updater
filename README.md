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
purpose is to scavenge the warframe wikia looking for news and updates and then 
update other services. 

Current Features
-----------------
Currently this project extracts data for the following mod types:

 - Warframes
 - Rifles
 - Shotguns
 - Pistols
 - Melee 
 - Sentinels
 - Kubrows
 - Sentinels
 - Auras
 - Stances

Currently, the stalker does **not** provide information about:
 
 - Kavats
 - Archwings
 - Archwing Melee
 - Archwing Rifles
 - Syndicate Mods
 - Rivens

Further versions of the stalker are planned to improve on this, but since the 
project stalks the Wikia, it is imperative to improve the wikia's quality first.

How to get the data?
-------------------
You can access all the current data on `server\extracted_info`. The files 
ending in `*_mods.json` contain an overview of all the mods of that category. 

For example, `warframe_mods.json` has an overview and basic information about 
all the warframe mods. 

The files ending in `*_mods_info.json` contain detailed information about all 
the mods of that category. 

The difference between these two types of files, is that the first file is at 
least one order of magnitutue faster to generate, while the last one is slower. 

When generating these files, use the API accordingly. 

Licensing and documentation
--------------------------

This project is under the [GPL license](https://en.wikipedia.org/wiki/GNU_General_Public_License), 
 and it's code is publicly [documented](https://fl4m3ph03n1x.github.io/warframe-db-updater/) as well.

