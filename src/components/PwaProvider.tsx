"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ar } from "@/lib/ar";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type PwaContextValue = {
  needRefresh: boolean;
  update: () => void;
  dismissUpdate: () => void;
  canInstall: boolean;
  install: () => Promise<void>;
};

const PwaContext = createContext<PwaContextValue | null>(null);

export function PwaProvider({ children }: { children: ReactNode }) {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      if (sessionStorage.getItem("clinic-pwa-updating") !== "1") return;
      reloading = true;
      sessionStorage.removeItem("clinic-pwa-updating");
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      const flagWaiting = () => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          setNeedRefresh(true);
        }
      };
      flagWaiting();
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed") flagWaiting();
        });
      });
    }).catch(() => {
      // Registration can fail on insecure origins. The app still works online.
    });

    navigator.storage?.persist?.().catch(() => {
      // iOS often refuses persistent storage. Local data stays in localStorage.
    });

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  function update() {
    sessionStorage.setItem("clinic-pwa-updating", "1");
    navigator.serviceWorker.ready.then((registration) => {
      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    });
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  return (
    <PwaContext.Provider
      value={{
        needRefresh,
        update,
        dismissUpdate: () => setNeedRefresh(false),
        canInstall: installEvent !== null,
        install,
      }}
    >
      {children}
      {needRefresh ? (
        <div
          className="pwa-update"
          role="alert"
        >
          <div className="notice-card notice-card--bar">
            <div className="min-w-32 flex-1">
              <strong>{ar.pwa.updateTitle}</strong>
              <p>{ar.pwa.updateBody}</p>
            </div>
            <button type="button" onClick={update} className="clinic-button clinic-button--primary">
              {ar.pwa.update}
            </button>
            <button type="button" onClick={() => setNeedRefresh(false)} className="notice-dismiss">
              {ar.pwa.dismiss}
            </button>
          </div>
        </div>
      ) : null}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  const value = useContext(PwaContext);
  if (!value) {
    throw new Error("usePwa must be used within PwaProvider");
  }
  return value;
}
