'use client';

import { store } from "@/store/store"
import { ReactNode } from "react"
import { Provider } from "react-redux"
import { ToastProvider } from "./toast-provider"
import { ThemeProvider } from "@/lib/contexts/ThemeContext";

const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Provider store={store}>
                <ThemeProvider>
                    {children}
                    <ToastProvider />
                </ThemeProvider>
            </Provider>
        </>
    )
}

export default Providers