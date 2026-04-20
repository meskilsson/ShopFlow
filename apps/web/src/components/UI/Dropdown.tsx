import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

import type { ReactNode, ReactElement } from "react";
import styles from "./Dropdown.module.css";

type DropdownContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within <Dropdown>");
  }
  return context;
}

// Root
type DropdownProps = {
  children: ReactNode;
};

export default function Dropdown({ children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className={styles.dropdown} ref={ref}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// Trigger (supports asChild pattern)
type TriggerProps = {
  children: ReactNode;
  asChild?: boolean;
};

Dropdown.Trigger = function DropdownTrigger({
  children,
  asChild = false,
}: TriggerProps) {
  const { open, setOpen } = useDropdownContext();

  if (asChild && React.isValidElement(children)) {
    const child = children as ReactElement<any>;

    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        setOpen((prev) => !prev);
      },
      "aria-expanded": open,
    });
  }

  return (
    <button
      className={styles.trigger}
      onClick={() => setOpen((prev) => !prev)}
      aria-expanded={open}
    >
      {children}
    </button>
  );
};

// Content
type ContentProps = {
  children: ReactNode;
};

Dropdown.Content = function DropdownContent({ children }: ContentProps) {
  const { open, setOpen } = useDropdownContext();

  return (
    <div className={`${styles.menu} ${open ? styles.menuOpen : ""}`}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        const element = child as ReactElement<any>;

        return React.cloneElement(element, {
          className: `${styles.item} ${element.props.className || ""}`,
          onClick: (e: React.MouseEvent) => {
            element.props.onClick?.(e);
            setOpen(false);
          },
        });
      })}
    </div>
  );
};