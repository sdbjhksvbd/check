# tsidx_scan.py
# usage: splunk cmd python tsidx_scan.py [path]
# example: splunk cmd python tsidx_scan.py /opt/splunk/var/lib/splunk
# run tsidxprobe for each tsidx file found, beginning at the (optional) specified path
# and output the results to tsidxprobe.YYYY-MM-DD.txt
# starts at $SPLUNK_DB if path omitted

import fnmatch
import os
import sys
import datetime
import subprocess

SPLUNK_HOME= os.environ['SPLUNK_HOME']
SPLUNK_DB= os.environ['SPLUNK_DB']

######
def tsidxprobe(path):
    """
    invoke tsidxprobe executable for each *.tsidx in the path and write results to a text file
    """
    pattern = '*.tsidx'
    if os.name == 'posix':  # unix
        cmd = 'tsidxprobe'
    elif os.name == 'nt':   # windows
        cmd = 'tsidxprobe.exe'
    else:
        print("unrecognized os.name %s, exiting" % os.name)
        return

    now = datetime.datetime.now()
    outputfile = "tsidxprobe."+str(now.year)+"-"+str(now.month)+"-"+str(now.day)+".txt"
    binPath = os.path.join(SPLUNK_HOME, "bin")

    try:
        fd = open(outputfile, "w")
    except IOError as e:
        print("Error %s opening file %s, exiting." % (e,outputfile))
        return

    fd.write("tsidxprobe report for instance installed in "+SPLUNK_HOME+"\n")
    fd.write("with index located in "+SPLUNK_DB+"\n")
    fd.write("starting path "+path+"\n")
    fd.write("run "+str(now)+"\n\n")
    
    for dirpath, dirnames, files in os.walk(path):
        for filename in fnmatch.filter(files, pattern):

            sys.stdout.write(".")
            sys.stdout.flush()

            current_file = os.path.join(dirpath, filename)
            args = [os.path.join(binPath,cmd),       # path to tsidxprobe binary
                    current_file] # path to tsidx file
            proc = subprocess.run(args,
                                  stdin=None,
                                  stdout=subprocess.PIPE,
                                  stderr=None,
                                  shell=False,
                                  text=True)
            fd.write("##################################\n")
            results = proc.stdout.splitlines()
            if len(proc.stdout)<1:
                fd.write("### !!! Error: no tsidxprobe results for %s\n" % current_file)
            else:
                for line in results:
                    fd.write(line)

    fd.close()
    print("\n\ntsidx_scan output file: %s\n" % outputfile)


if __name__ == '__main__':

    if sys.version_info.major == 2:
        print("This script must be run using Python 3.")
        sys.exit(1)

    ######
    # if a path is provided, start scanning from there
    # if none, use $SPLUNK_DB 
    
    argpath=None
    
    if len(sys.argv) < 2:
        argpath = SPLUNK_DB
    elif (sys.argv[1] == "-h") or (sys.argv[1] == "--help"):
        print("usage: splunk cmd python tsidx_scan.py [path]")
        print("example: splunk cmd python tsidx_scan.py /opt/splunk/var/lib/splunk")
    else:
        argpath = sys.argv[1]
    
    if argpath:
        tsidxprobe(argpath)
    
    
    
