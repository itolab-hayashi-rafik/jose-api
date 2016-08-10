#!/bin/bash

GW_SECRET=~/.ssh/jose.key
NODE_SECRET=~/.ssh/jose-id_rsa
LOCAL_PORT=3000
REMOTE_PORT=3000

for host in 10.1.0.{4..43};
do
    echo "localhost:${LOCAL_PORT} <-- gw.jose.jp <-- ${host}:${REMOTE_PORT}"
    ssh -o StrictHostKeyChecking=no -o ProxyCommand="ssh -i \"${GW_SECRET}\" gw.jose.jp -p 2360 -W %h:%p" -C -N -f -i "${NODE_SECRET}" -R ${LOCAL_PORT}:${host}:${REMOTE_PORT} ${host}
done
