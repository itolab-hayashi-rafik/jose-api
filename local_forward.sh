#!/bin/bash

GW_SECRET=~/.ssh/jose.key
NODE_SECRET=~/.ssh/jose-id_rsa
REMOTE_PORT=7000

local_port=7000
for host in 10.1.0.{4..43};
do
    local_port=$((local_port+1))
    echo "localhost:${local_port} --> gw.jose.jp --> ${host}:${REMOTE_PORT}"
    ssh -o StrictHostKeyChecking=no -o ProxyCommand="ssh -i \"${GW_SECRET}\" gw.jose.jp -p 2360 -W %h:%p" -C -N -f -i "${NODE_SECRET}" -L ${local_port}:${host}:${REMOTE_PORT} ${host}
done
