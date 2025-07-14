/* *********************************************************************
 * Copyright (C) 2007-2015 VMware, Inc. All Rights Reserved. -- VMware Confidential
 * *********************************************************************/

/*
 * This test app finds all running virtual machines
 * and opens a handle to each.
 *
 * As each virtual machine is found, a callback routine opens
 * the virtual machine.
 * Another method would be to collect all the virtual machine names
 * synchronously (without callbacks), and then open them in a later step.
 */

#include <stdio.h>
#include <stdlib.h>
#ifdef _WIN32
#include "windows.h"    // for Sleep()
#else
#include <unistd.h>     // for sleep()
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

#endif    // USE_WORKSTATION

#define VM_HANDLE_ARRAY_SIZE 32

/*
 * Global variables.
 */

VixHandle   vmHandles[VM_HANDLE_ARRAY_SIZE];
int vmHandleIndex = 0;
int totalVMCount = 0;
VixHandle   hostHandle = VIX_INVALID_HANDLE;


/*
 * Local functions.
 */

/*
 *-----------------------------------------------------------------------------
 *
 * open_cb --
 *
 *     The callback passed to VixVM_Open. This takes the result handle
 *     from the job, and adds it to the global array of virtual machine
 *     handles so that the main function can access it.
 *
 *-----------------------------------------------------------------------------
 */
static void
open_cb(VixHandle jobHandle,    // IN
        VixEventType ev,        // IN
        VixHandle moreEvInfo,   // IN
        void *cd)               // IN
{
   VixError err = VIX_OK;
   VixHandle vm;

   if (VIX_EVENTTYPE_JOB_COMPLETED != ev) {
      return;
   }

   err = Vix_GetProperties(jobHandle,
                           VIX_PROPERTY_JOB_RESULT_HANDLE,
                           &vm,
                           VIX_PROPERTY_NONE);

   if (VIX_SUCCEEDED(err)) {
      vmHandles[vmHandleIndex++] = vm;
      printf("Added virtual machine handle #%d %d\n", vmHandleIndex, vm);
   } else {
      fprintf(stderr,
              "Error getting virtual machine handle: %s\n",
              Vix_GetErrorText(err, NULL));
   }
   Vix_ReleaseHandle(jobHandle);
}


/*
 *-----------------------------------------------------------------------------
 *
 * find_cb --
 *
 *     The callback passed to VixHost_FindItems. This takes the virtual
 *     machine that the find command found, and open it.
 *     This will be called once for each virtual machine that FindItems
 *     finds.
 *
 *-----------------------------------------------------------------------------
 */

static void
find_cb(VixHandle jobHandle,   // IN
        VixEventType ev,       // IN
        VixHandle moreEvInfo,  // IN
        void *cd)              // IN
{
   VixError err = VIX_OK;
   char *loc = NULL;
   VixHandle openJobHandle;

   /*
    * Ignore any events other than a job completing.
    */
   if (VIX_EVENTTYPE_FIND_ITEM != ev) {
      return;
   }

   /*
    * Only open as many virtual machines as we have allocated
    * space for.
    */
   if (totalVMCount < VM_HANDLE_ARRAY_SIZE) { 

      err = Vix_GetProperties(moreEvInfo,
                              VIX_PROPERTY_FOUND_ITEM_LOCATION,
                              &loc,
                              VIX_PROPERTY_NONE);
      if (VIX_SUCCEEDED(err)) {
         printf("Found a virtual machine with vmx file located at: '%s'\n", loc);
         totalVMCount++;
         openJobHandle = VixVM_Open(hostHandle,
                                    loc,
                                    open_cb,
                                    NULL);

         Vix_FreeBuffer(loc);
      } else {
         fprintf(stderr,
                 "GetProperties failed (%s)\n",
                 Vix_GetErrorText(err, NULL));
      }
   } else {
      fprintf(stderr, "Warning: found too many virtual machines!\n"); 
   }
}

////////////////////////////////////////////////////////////////////////////////
int
main(int argc, char **argv)
{
   VixError    err;
   VixHandle   jobHandle = VIX_INVALID_HANDLE;
   VixHandle   vmHandle = VIX_INVALID_HANDLE;
   int i;

   jobHandle = VixHost_Connect(VIX_API_VERSION,
                               CONNTYPE,
                               HOSTNAME,
                               HOSTPORT,
                               USERNAME,
                               PASSWORD,
                               0,
                               VIX_INVALID_HANDLE,
                               NULL,
                               NULL);
   err = VixJob_Wait(jobHandle,
                     VIX_PROPERTY_JOB_RESULT_HANDLE,
                     &hostHandle,
                     VIX_PROPERTY_NONE);
   Vix_ReleaseHandle(jobHandle);
   if (VIX_FAILED(err)) {
      fprintf(stderr,
              "Failed to connect to host (%s)\n",
              Vix_GetErrorText(err, NULL));
      goto abort;
   }

   printf("About to find running virtual machines\n");

   jobHandle = VixHost_FindItems(hostHandle,
                                 VIX_FIND_RUNNING_VMS,
                                 VIX_INVALID_HANDLE,
                                 -1,
                                 find_cb,
                                 NULL);

   err = VixJob_Wait(jobHandle, VIX_PROPERTY_NONE);
   Vix_ReleaseHandle(jobHandle);
   if (VIX_FAILED(err)) {
      fprintf(stderr,
              "FindItems failed (%s)\n",
              Vix_GetErrorText(err, NULL));
      goto abort;
   }
   printf("Finished finding running virtual machines\n");

   // may still have Open's working, so wait until we get all our answers
   while (vmHandleIndex < totalVMCount) {
      SLEEP(1000);
   }

   printf("All virtual machines opened:\n");
   for (i = 0; i < vmHandleIndex; i++) {
      printf("Virtual machine handle: #%d %d\n", i, vmHandles[i]);
   }

 abort:
   for (i = 0; i < vmHandleIndex; i++) {
      Vix_ReleaseHandle(vmHandles[i]);
   }
   VixHost_Disconnect(hostHandle);
}
