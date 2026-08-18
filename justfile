GO_BUILD_FRAGS := '-ldflags="-s -w -buildid= -H=windowsgui" -trimpath'
GO_BUILD_DEBUG_FRAGS := '-ldflags="-s -w -buildid=" -trimpath'
EXE_NAME := "ani_tracker"

build:
	bun run build
	go build -o ./build/dist/{{EXE_NAME}}.exe {{GO_BUILD_FRAGS}} main.go
build_debug:
	go build -tags=TOAST_DEBUG -o ./build/dist/{{EXE_NAME}}.exe {{GO_BUILD_DEBUG_FRAGS}} main.go
	./build/dist/{{EXE_NAME}}.exe
start_dev_server:
	go build -tags=TOAST_DEBUG,TOAST_DEV_MODE -o ./build/dist/{{EXE_NAME}}_dev.exe {{GO_BUILD_DEBUG_FRAGS}} main.go
	./build/dist/{{EXE_NAME}}_dev.exe