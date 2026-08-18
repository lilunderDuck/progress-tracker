package utils

import (
	"os"
	"path/filepath"
)

func GetCurrentExecutablePath() string {
	exePath, err := os.Executable()
	if err != nil {
		panic(err)
	}

	return filepath.Dir(exePath)
}

func EnsureDirIsCreated(dir string) {
	if err := os.MkdirAll(dir, 0755); err != nil {
		panic("Failed to create local data directory: " + err.Error())
	}
}
