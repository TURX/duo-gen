#!/usr/bin/env zsh

cd ~/Scripts || exit

USER=""  # Your NetID
PASS=""  # Your NetID password

while true; do
    CODE=$(duo-gen next --config "$PWD/duo.json")
    echo $PASS > oc_pw.txt
    echo $CODE >> oc_pw.txt
    # Connect use SOCKS5 proxy on port 11080
    cat oc_pw.txt | openconnect --script-tun --script "ocproxy -D 11080" --passwd-on-stdin -u $USER --protocol=gp --non-inter --os=linux-64 uwmadison.vpn.wisc.edu
    echo "[OC] Disconnected"
    sleep 5
    echo "[OC] Reconnecting..."
done
