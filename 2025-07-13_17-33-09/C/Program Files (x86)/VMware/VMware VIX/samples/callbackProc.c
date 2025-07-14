/* *********************************************************************
 * Copyright (C) 2007-2015 VMware, Inc. All Rights Reserved. -- VMware Confidential
 * *********************************************************************/

/*
 * This sample demonstrates how to use callback procedures
 * when calling asynchronous Vix functions.
 *
 * The main caller thread in this sample is simple, and just spins while
 * waiting for the function to return. A more sophisticated example could
 * do other work.
 */

#include <stdio.h>
#include <stdlib.h>
#ifdef _WIN32
#include "windows.h"
#else
#include <unistd.h>
#endif
#include "vix.h"


/*
 * Define a cross platform SLEEP(x) that sleeps for x milliseconds.
 */
#ifdef _WIN32
#define SLEEP(x) Sleep(x)
#else
#define SLEEP(x) sleep((x)/1000)
#endif


/*
 * Certain arguments differ between VMware Server and Workstation
 * Comment out this definition to use this code with VMware Server 2.0.
 */
#define USE_WORKSTATION

#ifdef USE_WORKSTATION

#define  CONNTYPE    VIX_SERVICEPROVIDER_VMWARE_WORKSTATION

#define  HOSTNAME ""
#define  HOSTPORT 0
#define  USERNAME ""
#define  PASSWORD ""

#define  VMPOWEROPTIONS   VIX_VMPOWEROP_LAUNCH_GUI   // Launches the VMware Workstaion UI
                                                     // when powering on the virtual machine.

#define VMXPATH_INFO "where vmxpath is an absolute path to the .vmx file " \
                     "for the virtual machine."

#else    // USE_WORKSTATION

/*
 * For VMware Server 2.0
 */

#define CONNTYPE VIX_SERVICEPROVIDER_VMWARE_VI_SERVER

#define HOSTNAME "https://192.2.3.4:8333/sdk"
/*
 * NOTE: HOSTPORT is ignored, so the port should be specified as part
 * of the URL.
 */
#define HOSTPORT 0
#define USERNAME "root"
#define PASSWORD "hideme"

#define  VMPOWEROPTIONS VIX_VMPOWEROP_NORMAL

#define VMXPATH_INFO "where vmxpath is a datastore-relative path to the " \
                     ".vmx file for the virtual machine, such as "        \
                     "\"[standard] ubuntu/ubuntu.vmx\"."

#endif    // USE_WORKSTATION


/*
 * Global variables.
 */

static char *progName;


/*
 * Local functions.
 */

void MyCallbackProc(VixHandle jobHandle,
                    VixEventType eventType,
                    VixHandle moreEventInfo,
                    void *clientData);


////////////////////////////////////////////////////////////////////////////////
static void
usage()
{
   fprintf(stderr, "Usage: %s <vmxpath>\n", progName);
   fprintf(stderr, "%s\n", VMXPATH_INFO);
   
}


////////////////////////////////////////////////////////////////////////////////
int
main(int argc, char **argv)
{
    VixError err;
    char *vmxPath;
    VixHandle hostHandle = VIX_INVALID_HANDLE;
    VixHandle jobHandle = VIX_INVALID_HANDLE;
    VixHandle vmHandle = VIX_INVALID_HANDLE;
    int jobIsReady = 0;

    progName = argv[0];
    if (argc > 1) {
        vmxPath = argv[1];
    } else {
        usage();
        exit(EXIT_FAILURE);
    }

    jobIsReady = 0;
    jobHandle = VixHost_Connect(VIX_API_VERSION,
                                CONNTYPE,
                                HOSTNAME, // *hostName,
                                HOSTPORT, // hostPort,
                                USERNAME, // *userName,
                                PASSWORD, // *password,
                                0, // options,
                                VIX_INVALID_HANDLE, // propertyListHandle,
                                &MyCallbackProc, // *callbackProc,
                                &jobIsReady); // *clientData);
    while (!jobIsReady) {
       SLEEP(1000);
    }

    err = Vix_GetProperties(jobHandle, 
                            VIX_PROPERTY_JOB_RESULT_HANDLE, 
                            &hostHandle,
                            VIX_PROPERTY_NONE);
    if (VIX_FAILED(err)) {
        goto abort;
    }

    Vix_ReleaseHandle(jobHandle);
    jobIsReady = 0;
    jobHandle = VixVM_Open(hostHandle,
                           vmxPath,
                           MyCallbackProc, // VixEventProc *callbackProc,
                           &jobIsReady); // void *clientData);
    while (!jobIsReady) {
       SLEEP(1000);
    }

    err = Vix_GetProperties(jobHandle, 
                            VIX_PROPERTY_JOB_RESULT_HANDLE,
                            &vmHandle,
                            VIX_PROPERTY_NONE);
    if (VIX_FAILED(err)) {
        goto abort;
    }

    Vix_ReleaseHandle(jobHandle);
    jobIsReady = 0;
    jobHandle = VixVM_PowerOn(vmHandle,
                              VMPOWEROPTIONS,
                              VIX_INVALID_HANDLE,
                              MyCallbackProc, // *callbackProc,
                              &jobIsReady); // *clientData);
    while (!jobIsReady) {
       SLEEP(1000);
    }

    Vix_ReleaseHandle(jobHandle);
    jobIsReady = 0;
    jobHandle = VixVM_PowerOff(vmHandle,
                              VIX_VMPOWEROP_NORMAL,
                              MyCallbackProc, // *callbackProc,
                              &jobIsReady); // *clientData);
    while (!jobIsReady) {
       SLEEP(1000);
    }

abort:
    Vix_ReleaseHandle(jobHandle);
    Vix_ReleaseHandle(vmHandle);

    VixHost_Disconnect(hostHandle);

    return 0;
}




////////////////////////////////////////////////////////////////////////////////
void 
MyCallbackProc(VixHandle jobHandle,
               VixEventType eventType,
               VixHandle moreEventInfo,
               void *clientData)
{
   int *flagPointer = NULL;

   /*
    * Ignore any events other than a job completing.
    */
   if (VIX_EVENTTYPE_JOB_COMPLETED != eventType) {
      return;
   }

   flagPointer = (int *) clientData;
   if (NULL == flagPointer) {
      return;
   }

   *flagPointer = 1;
} // MyCallbackProc



