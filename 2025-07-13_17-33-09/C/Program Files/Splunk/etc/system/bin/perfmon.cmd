@echo off

set exit_code=0

:loop_args
if "%1" == "" goto continue
if "%1" == "--scheme" goto do_scheme
shift
goto loop_args

:do_scheme
echo ^<scheme^>
echo     ^<title^>Local performance monitoring^</title^>
echo     ^<description^>Collect performance data from the local machine.^</description^>
echo     ^<use_single_instance^>true^</use_single_instance^>
echo     ^<script^>splunk-perfmon.path^</script^>
echo     ^<streaming_mode^>xml^</streaming_mode^>
echo     ^<endpoint^>
echo         ^<id^>win-perfmon^</id^>
echo         ^<args^>
echo             ^<arg name="name"^>
echo                 ^<title^>name^</title^>
echo             ^</arg^>
echo             ^<arg name="counters"^>
echo                 ^<title^>counters^</title^>
echo                 ^<list_delimiter^>;^</list_delimiter^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="nonmetric_counters"^>
echo                 ^<title^>nonmetric_counters^</title^>
echo                 ^<list_delimiter^>;^</list_delimiter^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="instances"^>
echo                 ^<title^>instances^</title^>
echo                 ^<list_delimiter^>;^</list_delimiter^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="interval"^>
echo                 ^<validation^>is_pos_int('interval')^</validation^>
echo                 ^<title^>interval^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<data_type^>number^</data_type^>
echo             ^</arg^>
echo             ^<arg name="object"^>
echo                 ^<title^>object^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="showZeroValue"^>
echo                 ^<title^>showZeroValue^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="mode"^>
echo                 ^<title^>mode^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="samplingInterval"^>
echo                 ^<title^>samplingInterval^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="stats"^>
echo                 ^<title^>stats^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="useEnglishOnly"^>
echo                 ^<title^>useEnglishOnly^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="useWinApiProcStats"^>
echo                 ^<title^>useWinApiProcStats^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="formatString"^>
echo                 ^<title^>formatString^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="usePDHFmtNoCap100"^>
echo                 ^<title^>usePDHFmtNoCap100^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
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
