#!/bin/bash

export BUN_INSTALL="/usr/src/dashboard"
export PATH="$BUN_INSTALL/bin:$PATH"

bun run server.js