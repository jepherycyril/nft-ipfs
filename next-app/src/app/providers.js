"use client";

import * as React from "react";
import {
	RainbowKitProvider,
	getDefaultWallets,
	getDefaultConfig,
	darkTheme,
} from "@rainbow-me/rainbowkit";

import {
	argentWallet,
	trustWallet,
	ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";

import {
	sepolia
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const { wallets } = getDefaultWallets();

export const config = getDefaultConfig({
	appName: "IPFS-NFT",
	projectId: "e76793a189ebac9270a8b06a8e0fe467",

	wallets: [
		...wallets,
		{
			groupName: "Other",
			wallets: [argentWallet, trustWallet, ledgerWallet],
		},
	],
	chains: [
		sepolia
	],
	ssr: true,
});

export const queryClient = new QueryClient();

export function Providers({ children }) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
