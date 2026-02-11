#!/bin/bash

cd $(dirname $0)

rm -rf src/solver/cspuz
cp -r ../../../cspuz_core/build/cspuz_solver_backend/ src/solver/cspuz
