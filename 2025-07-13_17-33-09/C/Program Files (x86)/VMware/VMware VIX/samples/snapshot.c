/* *********************************************************************
 * Copyright (C) 2007-2015 VMware, Inc. All Rights Reserved. -- VMware Confidential
 * *********************************************************************/

/* This demonstrates how to open a virtual machine, create
 * a snapshot, and revert the snapshot. The virtual machine
 * will remain powered on at the end of this program.
 *
 * This uses the VixJob_Wait function to block after starting each
 * asynchronous function. This effectively makes the asynchronous
 * functions synchronous, because VixJob_Wait will not return until the
 * asynchronous function has completed.
 */

#include <stdio.h>
#include <stdlib.h>

#include "vix.h"


/*
 * Certain arguments differ when using VIX with VMware Server 2.0
 * and VMware Workstation.
 *
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
    VixHandle snapshotHandle = VIX_INVALID_HANDLE;
    int numSnapshots;

    progName = argv[0];
    if (argc > 1) {
        vmxPath = argv[1];
    } else {
        usage();
        exit(EXIT_FAILURE);
    }

    jobHandle = VixHost_Connect(VIX_API_VERSION,
                                CONNTYPE,
                                HOSTNAME, // *hostName,
                                HOSTPORT, // hostPort,
                                USERNAME, // *userName,
                                PASSWORD, // *password,
                                0, // options,
                                VIX_INVALID_HANDLE, // propertyListHandle,
                                NULL, // *callbackProc,
                                NULL); // *clientData);
    err = VixJob_Wait(jobHandle, 
                      VIX_PROPERTY_JOB_RESULT_HANDLE, 
                      &hostHandle,
                      VIX_PROPERTY_NONE);
    if (VIX_FAILED(err)) {
        goto abort;
    }

    Vix_ReleaseHandle(jobHandle);
    jobHandle = VixVM_Open(hostHandle,
                           vmxPath,
                           NULL, // VixEventProc *callbackProc,
                           NULL); // void *clientData);
    err = VixJob_Wait(jobHandle, 
                      VIX_PROPERTY_JOB_RESULT_HANDLE, 
                      &vmHandle,
                      VIX_PROPERTY_NONE);
    if (VIX_FAILED(err)) {
        goto abort;
    }
    Vix_ReleaseHandle(jobHandle);

    err = VixVM_GetNumRootSnapshots(vmHandle, &numSnapshots);
    if (VIX_FAILED(err)) {
        goto abort;
    }

    if (numSnapshots == 0) {
       /*
        * If there is not already a snapshot, create a new one, with the
        * virtual machine powered on.
        */
       jobHandle = VixVM_PowerOn(vmHandle,
                                 VMPOWEROPTIONS,
                                 VIX_INVALID_HANDLE,
                                 NULL, // *callbackProc,
                                 NULL); // *clientData);
       err = VixJob_Wait(jobHandle, VIX_PROPERTY_NONE);
       if (VIX_FAILED(err)) {
          goto abort;
       }
       
       Vix_ReleaseHandle(jobHandle);
       
       /*
        * Since the virtual machine is running, passing the 
        * VIX_SNAPSHOT_INCLUDE_MEMORY flag will make VixVM_CreateSnapshot()
        * save the run-time state of the machine, and not just the disk state.
        */
       jobHandle = VixVM_CreateSnapshot(vmHandle,
                                        "snapshotName",
                                        "snapshotDescription",
                                        VIX_SNAPSHOT_INCLUDE_MEMORY,
                                        VIX_INVALID_HANDLE,
                                        NULL, // *callbackProc,
                                        NULL); // *clientData);
       err = VixJob_Wait(jobHandle, 
                         VIX_PROPERTY_JOB_RESULT_HANDLE,
                         &snapshotHandle,
                         VIX_PROPERTY_NONE);
       if (VIX_FAILED(err)) {
          goto abort;
       }
       
       Vix_ReleaseHandle(jobHandle);
       jobHandle = VixVM_PowerOff(vmHandle,
                                  VIX_VMPOWEROP_NORMAL,
                                  NULL, // *callbackProc,
                                  NULL); // *clientData);
       err = VixJob_Wait(jobHandle, VIX_PROPERTY_NONE);
       if (VIX_FAILED(err)) {
          goto abort;
       }
       Vix_ReleaseHandle(jobHandle);
       
       /*
        * Release the handle before it gets overwritten when we call
        * VixVM_GetRootSnapshot().
        */
       Vix_ReleaseHandle(snapshotHandle);
       snapshotHandle = VIX_INVALID_HANDLE;

    }

    err = VixVM_GetRootSnapshot(vmHandle, 0, &snapshotHandle);
    if (VIX_FAILED(err)) {
        goto abort;
    }
    /*
     * Here we pass VMPOWEROPTIONS to RevertToSnapshot since we
     * took a snapshot of a powered on virtual machine, and the
     * virtual machine will then be powered on again when we revert.
     */
    jobHandle = VixVM_RevertToSnapshot(vmHandle, 
                                       snapshotHandle,
                                       VMPOWEROPTIONS, // options,
                                       VIX_INVALID_HANDLE,
                                       NULL, // *callbackProc,
                                       NULL); // *clientData);
    err = VixJob_Wait(jobHandle, VIX_PROPERTY_NONE);
    if (VIX_FAILED(err)) {
        goto abort;
    }


abort:
    Vix_ReleaseHandle(jobHandle);
    Vix_ReleaseHandle(vmHandle);
    Vix_ReleaseHandle(snapshotHandle);

    VixHost_Disconnect(hostHandle);

    return 0;
}


