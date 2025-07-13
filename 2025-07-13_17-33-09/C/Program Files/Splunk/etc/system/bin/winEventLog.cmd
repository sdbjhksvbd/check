@echo off

set exit_code=0

:loop_args
if "%1" == "" goto continue
if "%1" == "--scheme" goto do_scheme
shift
goto loop_args

:do_scheme
echo ^<scheme^>
echo     ^<title^>Local Windows event log monitoring^</title^>
echo     ^<description^>This is the Windows event log input.^</description^>
echo     ^<use_single_instance^>true^</use_single_instance^>
echo     ^<script^>splunk-winEvtLog.path^</script^>
echo     ^<streaming_mode^>xml^</streaming_mode^>
echo     ^<endpoint^>
echo         ^<id^>WinEventLog^</id^>
echo         ^<args^>
echo             ^<arg name="name"^>
echo                 ^<title^>LogName^</title^>
echo             ^</arg^>
echo             ^<arg name="start_from"^>
echo                 ^<title^>start_from^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="use_threads"^>
echo                 ^<title^>use_threads^</title^>
echo                 ^<validation^>is_pos_int('use_threads')^</validation^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo                 ^<data_type^>number^</data_type^>
echo             ^</arg^>
echo             ^<arg name="thread_wait_time_msec"^>
echo                 ^<title^>thread_wait_time_msec^</title^>
echo                 ^<validation^>is_pos_int('thread_wait_time_msec')^</validation^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo                 ^<data_type^>number^</data_type^>
echo             ^</arg^>
echo             ^<arg name="use_old_eventlog_api"^>
echo                 ^<title^>use_old_eventlog_api^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="suppress_checkpoint"^>
echo                 ^<title^>suppress_checkpoint^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="suppress_sourcename"^>
echo                 ^<title^>suppress_sourcename^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="suppress_keywords"^>
echo                 ^<title^>suppress_keywords^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="suppress_type"^>
echo                 ^<title^>suppress_type^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="suppress_task"^>
echo                 ^<title^>suppress_task^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="suppress_opcode"^>
echo                 ^<title^>suppress_opcode^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="current_only"^>
echo                 ^<title^>current_only^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="checkpointInterval"^>
echo                 ^<title^>checkpointInterval^</title^>
echo                 ^<validation^>is_pos_int('checkpointInterval')^</validation^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo                 ^<data_type^>number^</data_type^>
echo             ^</arg^>          
echo             ^<arg name="batch_size"^>
echo                 ^<title^>batch_size^</title^>
echo                 ^<validation^>is_pos_int('batch_size')^</validation^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo                 ^<data_type^>number^</data_type^>
echo             ^</arg^>
echo             ^<arg name="evt_resolve_ad_obj"^>
echo                 ^<title^>evt_resolve_ad_obj^</title^>
echo                 ^<validation^>is_bool('evt_resolve_ad_obj')^</validation^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="evt_skip_GUID_resolution"^>
echo                 ^<title^>evt_resolve_ad_GUID^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="wec_event_format"^>
echo                 ^<title^>wec_event_format^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="evt_dc_name"^>
echo                 ^<title^>evt_dc_name^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="evt_resolve_ad_ds"^>
echo                 ^<title^>evt_resolve_ad_ds^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="evt_dns_name"^>
echo                 ^<title^>evt_dns_name^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="whitelist"^>
echo                 ^<title^>whitelist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="whitelist1"^>
echo                 ^<title^>whitelist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="whitelist2"^>
echo                 ^<title^>whitelist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="whitelist3"^>
echo                 ^<title^>whitelist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="whitelist4"^>
echo                 ^<title^>whitelist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="whitelist5"^>
echo                 ^<title^>whitelist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="whitelist6"^>
echo                 ^<title^>whitelist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="whitelist7"^>
echo                 ^<title^>whitelist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="whitelist8"^>
echo                 ^<title^>whitelist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="whitelist9"^>
echo                 ^<title^>whitelist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="blacklist"^>
echo                 ^<title^>blacklist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="blacklist1"^>
echo                 ^<title^>blacklist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="blacklist2"^>
echo                 ^<title^>blacklist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="blacklist3"^>
echo                 ^<title^>blacklist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="blacklist4"^>
echo                 ^<title^>blacklist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="blacklist5"^>
echo                 ^<title^>blacklist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="blacklist6"^>
echo                 ^<title^>blacklist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="blacklist7"^>
echo                 ^<title^>blacklist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="blacklist8"^>
echo                 ^<title^>blacklist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="blacklist9"^>
echo                 ^<title^>blacklist^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="suppress_text"^>
echo                 ^<title^>suppress_text^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="renderXml"^>
echo                 ^<title^>renderXml^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="checkpointSync"^>
echo                 ^<title^>checkpointSync^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<required_on_edit^>false^</required_on_edit^>
echo             ^</arg^>
echo             ^<arg name="evt_ad_cache_disabled"^>
echo                 ^<title^>evt_ad_cache_disabled^</title^>
echo                 ^<description^>Advanced option. Enables or disables account AD cache.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="evt_ad_cache_exp"^>
echo                 ^<title^>evt_ad_cache_exp^</title^>
echo                 ^<description^>Advanced option. Indicates expiraiton time for account AD cache entries.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="evt_ad_cache_exp_neg"^>
echo                 ^<title^>evt_ad_cache_exp_neg^</title^>
echo                 ^<description^>Advanced option. Indicates expiraiton time for negative account AD cache entries.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="evt_ad_cache_max_entries"^>
echo                 ^<title^>evt_ad_cache_max_entries^</title^>
echo                 ^<description^>Advanced option. Indicates maximum number of account AD cache entries.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="evt_exclude_fields"^>
echo                 ^<title^>evt_exclude_fields^</title^>
echo                 ^<description^>Excludes fields from event report.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="evt_sid_cache_disabled"^>
echo                 ^<title^>evt_sid_cache_disabled^</title^>
echo                 ^<description^>Advanced option. Enables or disables account sid cache.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="evt_sid_cache_exp"^>
echo                 ^<title^>evt_sid_cache_exp^</title^>
echo                 ^<description^>Advanced option. Indicates expiraiton time for account sid cache entries.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="evt_sid_cache_exp_neg"^>
echo                 ^<title^>evt_sid_cache_exp_neg^</title^>
echo                 ^<description^>Advanced option. Indicates expiraiton time for negative account sid cache entries.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="evt_sid_cache_max_entries"^>
echo                 ^<title^>evt_sid_cache_max_entries^</title^>
echo                 ^<description^>Advanced option. Indicates maximum number of account sid cache entries.
echo                 ^</description^>
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
