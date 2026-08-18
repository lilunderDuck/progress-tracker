package utils

import (
	"fmt"
	"os/exec"
	"runtime"
	"server/backend/debug"
	"server/backend/flags"
	"time"
)

func OpenBrowser(openDelayInMs int, url string) {
	if flags.DEBUG_MODE {
		debug.InfoLabelf("browser", "opening %s with the delay of %s miliseconds", url, debug.FormatNumber(openDelayInMs))
	}
	time.Sleep(time.Duration(openDelayInMs) * time.Millisecond)
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start", url}
	case "darwin":
		cmd = "open"
		args = []string{url}
	default: // Linux
		cmd = "xdg-open"
		args = []string{url}
	}

	go func() {
		err := exec.Command(cmd, args...).Start()
		if err != nil {
			panic(err)
		}
	}()
}

func OpenExplorer(path string) error {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		// Opens Windows Explorer highlighting the file/folder
		cmd = exec.Command("explorer", "/select,", path)
	case "darwin":
		// Opens macOS Finder revealing the file/folder
		cmd = exec.Command("open", "-R", path)
	case "linux":
		// Opens Linux file managers (GNOME, KDE, etc.) via XDG
		cmd = exec.Command("xdg-open", path)
	default:
		return fmt.Errorf("unsupported platform: %s", runtime.GOOS)
	}

	return cmd.Run()
}
