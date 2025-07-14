WRAPPER = -lvixAllProducts -ldl -lpthread
SERVER11 = /usr/lib/vmware-vix/lib/server-1/32bit/libvix.so
WORKST60 = /usr/lib/vmware-vix/lib/ws-3/32bit/libvix.so
SERVER20 = /usr/lib/vmware-vix/lib/VIServer-2.0.0/32bit/libvix.so
WORKST65 = /usr/lib/vmware-vix/lib/Workstation-6.5.0/32bit/libvix.so
WRAPORNOT = $(WRAPPER)
VIXH = -I/usr/include/vmware-vix

all: callbackProc fhostopen guestOps powerOn snapshot suspend

callbackProc: callbackProc.c
	gcc $(VIXH) callbackProc.c -o callbackProc $(WRAPORNOT)

fhostopen: fhostopen.c
	gcc $(VIXH) fhostopen.c -o fhostopen $(WRAPORNOT)

guestOps: guestOps.c
	gcc $(VIXH) guestOps.c -o guestOps $(WRAPORNOT)

powerOn: powerOn.c
	gcc $(VIXH) powerOn.c -o powerOn $(WRAPORNOT)

snapshot: snapshot.c
	gcc $(VIXH) snapshot.c -o snapshot $(WRAPORNOT)

suspend: suspend.c
	gcc $(VIXH) suspend.c -o suspend $(WRAPORNOT)

clean:
	rm -f callbackProc fhostopen guestOps powerOn snapshot suspend
