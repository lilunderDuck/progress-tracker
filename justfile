GO_BUILD_FRAGS := '-ldflags="-s -w -buildid= -H=windowsgui" -trimpath'
GO_BUILD_DEBUG_FRAGS := '-ldflags="-s -w -buildid=" -trimpath'
EXE_NAME := "progress_tracker"
OUTPUT_PATH := "./build/dist"

build:
	bun run build
	go build -o {{OUTPUT_PATH}}/{{EXE_NAME}}.exe {{GO_BUILD_FRAGS}} main.go
	upx --best {{OUTPUT_PATH}}/{{EXE_NAME}}.exe
build_debug:
	go build -tags=TOAST_DEBUG -o {{OUTPUT_PATH}}/{{EXE_NAME}}.exe {{GO_BUILD_DEBUG_FRAGS}} main.go
	{{OUTPUT_PATH}}/{{EXE_NAME}}.exe
start_dev_server:
	go build -tags=TOAST_DEBUG,TOAST_DEV_MODE -o {{OUTPUT_PATH}}/{{EXE_NAME}}_dev.exe {{GO_BUILD_DEBUG_FRAGS}} main.go
	{{OUTPUT_PATH}}/{{EXE_NAME}}_dev.exe