ï»¿#   Version 9.2.1
#
# This file contains possible setting and value pairs for federated provider entries
# for use when the federated search functionality is enabled.
#
# A federated search allows authorized users to run searches across multiple federated
# providers. Only Splunk deployments are supported as federated providers. Information
# on the Splunk deployment (i.e. the federated provider) is added in the federated
# provider stanza of the federated.conf file. A federated search deployment can have
# multiple federated search datasets. The settings for federated search dataset stanzas
# are located in savedsearches.conf.
#
# To learn more about configuration files (including precedence) please see the
# documentation located at
# http://docs.splunk.com/Documentation/Splunk/latest/Admin/Aboutconfigurationfiles
#

#
# Federated Provider Stanza
#
[provider]
* Each federated provider definition must have a separate stanza.
* <provider> must follow the following syntax: 
  provider://<unique-federated-provider-name>
* <unique-federated-provider-name> can contain only alphanumeric characters and 
  underscores.

type = [splunk]
* Specifies the type of the federated provider.
* A setting of 'splunk' means that the federated provider is a Splunk
  deployment.
* Default: splunk

hostPort = <Host_Name_or_IP_Address>:<service_port>
* Specifies the protocols required to connect to a federated provider.
* You can provide a host name or an IP address.
* The <service_port> can be any legitimate port number.
* No default.

serviceAccount = <user_name>
* Specifies the user name for a service account that has been set up on the
  federated provider for the purpose of enabling secure federated search.
* This service account allows the federated search head on your local Splunk
  platform deployment to query datasets on the federated provider in a secure
  manner.
* No default.

password = <password>
* Specifies the service account password for the user specified in the
  'serviceAccount' setting.
* No default.

appContext = <application_short_name>
* Specifies the Splunk application context for the federated searches that are
  run with this federated provider definition.
* NOTE: Applicable only to federated providers that have 'type = splunk' and
 'mode = standard'.
  * Federated providers with 'type = splunk' and 'mode = transparent' ignore
    the 'appContext' property. Such providers instead apply the application
    context of the federated search that is run from the local search head to
    the remote portion of the federated search that is run on the remote
    search head.
* Provision of an application context ensures that federated searches which use
  the federated provider are limited to the knowledge objects that are
  associated with the named application. Application context can also affect
  search job quota and resource allocation parameters.
* '<application_short_name>' must be the short name of a Splunk application
  currently installed on the federated provider. For example, the short name of
  Splunk IT Service Intelligence is 'itsi'.
  * Find the short names of apps installed on a Splunk deployment by going to
    'Apps > Manage Apps' and reviewing the values in the 'Folder name' column.
* You can create multiple federated provider definitions with 'type = splunk'
  and 'mode = standard' for the same remote search head that differ only by
  name and application context.
* Default: search

useFSHKnowledgeObjects = <boolean>
* Determines whether federated searches with this provider use knowledge
  objects from the federated provider (the remote search head) or from the
  federated search head (the local search head).
* When set to 'true' federated searches with this provider use knowledge
  objects from the federated search head.
* NOTE: This setting can be set to "true" only when the federated provider is in
  transparent mode. If this setting is set to "true" on a standard mode
  provider, the Splunk software considers the provider to be misconfigured and 
  ignores this setting when you run searches on it. So Splunk software always
  uses knowledge objects from the federated provider in standard mode.
* Default: false

mode = [ standard | transparent ]
* Specifies whether a federated provider is in standard or transparent mode.
* A setting of 'transparent' means that searches with the federated provider
  can use only knowledge objects from the federated search head. In other
  words, the value for 'useFSHKnowledgeObjects' is always interpreted by the
  transparent mode federated provider as 'true'.
* A setting of 'standard' means that the federated provider respects the
  setting of 'useFSHKnowledgeObjects'. In other words, searches with the
  federated provider can use knowledge objects from the remote search head or
  the federated search head.
* Default: standard


#
# General Federated Search Stanza
#
[general]
* This stanza is for settings that are applicable to the overall logic for
  search federation. They are typically applicable to all federated providers
  and all search head cluster members.

needs_consent = <boolean>
* A setting of 'true' causes a checkbox to appear in the federated provider
  definition UI. This checkbox requires that users legally acknowledge that
  federated providers can be set up in a manner detrimental to regulatory
  compliance.
* Default: true

heartbeatEnabled = <boolean>
* Specifies whether the federated search heartbeat mechanism is running.
* A setting of 'true' means the heartbeat mechanism is running on an interval
  specified by 'heartbeatInterval'.
* The heartbeat mechanism monitors the remote federated providers for this
  Splunk platform instance. When you run federated searches and the heartbeat
  mechanism has detected problems with the federated providers, it can tell you
  what is wrong and take actions.
  * If a federated provider is found to be unreachable a consecutive number of
    times set by 'connectivityFailuresThreshold', the heartbeat mechanism sets
    the federated provider to an invalid state, meaning it ignores the
    unreachable provider in federated searches.
      * When the heartbeat mechanism reconnects to the provider, it resets the
        provider to a valid state.
  * If two transparent mode federated providers are found to point to the same
    server ID, the heartbeat mechanism randomly chooses one provider to run the
    search over.
    * On Splunk Enterprise deployments, this functionality is extended so that
      it also detects when two transparent mode federated providers share the
      same cluster ID. For this extension to work, the service accounts for the
      transparent mode federated providers must have the
      list_search_head_clustering capability.
* A setting of 'false' means the heartbeat mechanism does not take actions when
  it detects problems with providers.
* NOTE: Do not change this setting unless instructed to do so by Splunk
  Support.
* Default: true

heartbeatInterval = <integer>
* The interval, in seconds, of the federated search heartbeat mechanism.
  It's value should be greater than 5 seconds.
* When 'heartbeatEnabled = true' the federated search heartbeat mechanism
  performs its federated provider monitoring activities on this interval.
* NOTE: Do not change this setting unless instructed to do so by Splunk
  Support.
* Default: 60

connectivityFailuresThreshold = <integer>
* When the federated search heartbeat mechanism detects this number of
  consecutive connectivity failures for a specific remote provider, the
  heartbeat mechanism sets the remote provider to an invalid state.
* When the heartbeat mechanism successfully reconnects to an invalid state
  federated provider, it resets the federated provider to a valid state.
* NOTE: Do not change this setting unless instructed to do so by Splunk
  Support.
* Default: 3

controlCommandsMaxThreads = <int>
* The maximum number of threads that can run a federated search action, such as 
  a search pause or search cancellation, from a local federated search head on 
  the federated providers.
* Change this setting only when directed to do so by Splunk Support.
* Default: 5

controlCommandsMaxTimeThreshold = <int>
* The maximum number of seconds that a federated search action, such as
  a search pause or search cancellation, from a local federated search head waits
  for the federated providers to finish the same command.
* Change this setting only when directed to do so by Splunk Support.
* Default: 5

controlCommandsFeatureEnabled = <boolean>
* Specifies whether a federated search head can send a federated search action,
  such as a search pause or search cancellation, to federated providers.
* Change this setting only when directed to do so by Splunk Support.
* Default: true

proxyBundlesTTL = <int>
* Specifies the time to live in seconds of a proxy bundle on the remote search 
  head after the last time it was used for a search.
* Change this setting only when directed to do so by Splunk Support.
* Default: 172800

remoteEventsDownloadRetryCountMax = <integer>
* When you run a verbose-mode federated search, the federated search head 
  downloads events from the federated provider. 
* If this event download fails, the federated search head retries the download.
* This setting sets the maximum number of event download retries that the 
  federated search head can make before it reports a failure.
* See 'remoteEventsDownloadRetryTimeoutMs' for the interval between retries.
* Change this setting only when directed to do so by Splunk Support.
* Default: 20

remoteEventsDownloadRetryTimeoutMs = <int>
* Specifies the interval, in milliseconds, between retries of a failed event 
  download from a federated provider. 
* See 'remoteEventsDownloadRetryCountMax' for the total number of event 
  download retries a federated search head can make before it must report a 
  failure.
* Change this setting only when directed to do so by Splunk Support.
* Default: 1000

verbose_mode = <boolean>
* Specifies whether federated searches can be run in verbose mode. 
* A setting of 'false' restricts the ability of federated searches to run in 
  verbose mode, while allowing federated searches to run in fast and smart 
  mode.  
* In Transparent Mode, a setting of 'false' means that Splunk software runs 
  only the local portion of a verbose mode federated search.
* In Standard Mode, a setting of 'false' terminates verbose mode federated 
  searches without displaying their results.  
* NOTE: Do not change this setting unless instructed to do so by Splunk Support.
* Default: true

#
# Configs for blocking unsupported commands for standard mode configs
# Change this setting only when instructed to do so by Splunk Support.
[s2s_smode_unsupported_command:metadata]
* This stanza controls whether the metadata command is blocked for 
  Federated Search for Splunk on standard mode federated providers.

active = <boolean>
* Whether Splunk software blocks the 'metadata' command for standard mode 
  federated search.
  * A value of "true" means that the 'metadata' command is not blocked for 
    standard mode federated search.
  * A value of "false" means that the 'metadata' command is blocked for 
    standard mode federated search. 
* NOTE: Do not change this setting unless instructed to do so by Splunk 
  Support. 
* Default: false

# Change this setting only when instructed to do so by Splunk Support.
[s2s_smode_unsupported_command:metasearch]
* This stanza controls whether the metasearch command is blocked for 
  Federated Search for Splunk on standard mode federated providers.

active = <boolean>
* Whether Splunk software blocks the 'metasearch' command for standard mode 
  federated search.
  * A value of "true" means that the 'metasearch' command is not blocked for 
    standard mode federated search.
  * A value of "false" means that the 'metasearch' command is blocked for 
    standard mode federated search. 
* NOTE: Do not change this setting unless instructed to do so by Splunk 
  Support. 
* Default: false

# Change this setting only when instructed to do so by Splunk Support.
[s2s_transparent_mode_unsupported_command:makeresults]
* This stanza controls whether Splunk software blocks the 'makeresults' command 
  on transparent mode federated providers for Federated Search for Splunk.

active = <boolean>
* Controls whether Splunk software blocks the 'makeresults' command for 
  transparent mode federated search.
  * A value of "true" means that Splunk software does not block the 
    'makeresults' command for transparent mode federated search.
  * A value of "false" means that Splunk software blocks the 'makeresults' 
    command for transparent mode federated search. The 'makeresults' command 
    still runs on your local search head.
* Even when 'active=false', you can run a 'makeresults' search over a 
  transparent mode federated provider when the following things are true:
  * The 'allow_target' setting is set to 'true' and you use the 'splunk_server' 
    or 'splunk_server_group' arguments in conjunction with the 'makeresults' 
    command. 
  * The 'splunk_server' or 'splunk_server_group' arguments point to a server or 
    server group that exists on the transparent mode federated provider.
* NOTE: Do not change this setting unless instructed to do so by Splunk 
  Support. 
* Default: false

allow_target = <boolean>
* Determines whether you can run the 'makeresults' command over transparent 
  mode federated providers with the 'splunk_server' or 'splunk_server_group' 
  arguments even when 'active = false'.
  * A value of "true" means that you can run the specified command over 
    transparent mode federated providers when you use the 'splunk_server' or 
    'splunk_server_group' argument in conjunction with the command. 
    * If you do not specify a server or server group that exists on the the 
      transparent mode federated provider, Splunk software blocks 'makeresults' 
      for transparent mode federated search, and runs only on your local search 
      head.
  * A value of "false" means that you cannot run 'makeresults' over transparent 
    mode federated providers even when you use the 'splunk_server' or 
   'splunk_server_group' arguments to specify servers or server groups that 
   exist on the transparent mode provider.  
* NOTE: Do not change this setting unless instructed to do so by Splunk 
  Support. 
* Default: true
