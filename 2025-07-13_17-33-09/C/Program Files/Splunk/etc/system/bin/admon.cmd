@echo off

set exit_code=0

:loop_args
if "%1" == "" goto continue
if "%1" == "--scheme" goto do_scheme
shift
goto loop_args

:do_scheme
echo ^<scheme^>
echo     ^<title^>Active Directory monitoring^</title^>
echo     ^<description^>This is an input for Active Directory.^</description^>
echo     ^<use_single_instance^>true^</use_single_instance^>
echo     ^<script^>splunk-admon.path^</script^>
echo     ^<streaming_mode^>xml^</streaming_mode^>
echo     ^<endpoint^>
echo         ^<id^>win-admon^</id^>
echo         ^<args^>
echo             ^<arg name="name"^>
echo                 ^<title^>name^</title^>
echo             ^</arg^>
echo             ^<arg name="targetDc"^>
echo                 ^<title^>targetDc^</title^>
echo                 ^<description^>Specifies a fully qualified domain name of a valid, network-accessible DC. If not specified, Splunk will obtain the local computer's DC by default, and bind to its root Distinguished Name (DN)
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="startingNode"^>
echo                 ^<title^>startingNode^</title^>
echo                 ^<description^>Tells Splunk where in the Active Directory directory tree to start monitoring. If not specified, Splunk will attempt to start at the root of the directory tree, by default. Where Splunk starts monitoring is determined by the user Splunk is configured to run as on the computer running Active Directory monitor.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="monitorSubtree"^>
echo                 ^<title^>monitorSubtree^</title^>
echo                 ^<description^>Tells Splunk whether or not to monitor the subtree(s) of a given directory tree path. Defaults to 1 (monitor subtrees of a given directory tree path).
echo                 ^</description^>
echo                 ^<data_type^>boolean^</data_type^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="printSchema"^>
echo                 ^<title^>printSchema^</title^>
echo                 ^<description^>Tells Splunk whether or not to print Active Directory schema.Defaults to 1 (print schema of Active Directory).
echo                 ^</description^>
echo                 ^<data_type^>boolean^</data_type^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="baseline"^>
echo                 ^<title^>baseline^</title^>
echo                 ^<description^>Tells Splunk whether to query baseline objects. Baseline objects are objects which currently reside in Active Directory. Baseline objects also include previously deleted objects. Defaults to 1 (query baseline objects).
echo                 ^</description^>
echo                 ^<data_type^>boolean^</data_type^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo         ^</args^>
echo     ^</endpoint^>
echo ^</scheme^>

goto exit_script

:continue
:: no support for any cmdline arg other than --scheme
echo Usage: %0 --scheme
set exit_code=1

:exit_script
exit /b %exit_code%
