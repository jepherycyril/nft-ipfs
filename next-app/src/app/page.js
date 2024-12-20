"use client";
import Image from "next/image";
import { Courier_Prime } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useState } from "react";
import { NFT_CONTRACT_ADDRESS, abi } from "@/constants";
import { parseEther } from "viem";

const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"] });

export default function Home() {
	const [isLoading, setIsLoading] = useState(false);

	const account = useAccount();

	const numOfTokensMinted = useReadContract({
		abi,
		address: NFT_CONTRACT_ADDRESS,
		functionName: "tokenIds",
	}).data;

	const { writeContractAsync } = useWriteContract();

	const mintToken = async () => {
		setIsLoading(true);

		try {
			await writeContractAsync(
				{
					abi,
					address: NFT_CONTRACT_ADDRESS,
					functionName: "mint",
					value: parseEther("0.01"),
				},
				{
					onSuccess(result) {
						console.log(result);
					},
				}
			);
			window.alert("Successfully minted!");
		} catch (error) {
			console.error(error);
			window.alert("Could not mint NFT :(");
		}
		setIsLoading(false);
	};

	return (
		<main
			className={
				courier.className +
				" flex text-white min-h-screen flex-col items-center justify-center p-24 bg-gray-900"
			}
		>
			{/* don't leave out the space before flex. If you don't, the className will be something like: couriersclassnameflex text-white..., which will thus not apply the rules we want */}

		<div className="flex w-full">
			<div className="flex flex-col gap-2  w-[60%]">
				<h1 className={"text-4xl"}> Welcome to LW3Punks</h1>
				<h2 className={"text-lg"}>
				It is an NFT collection for LearnWeb3 students.
				</h2>
		<div>
			{/* numOfTokensMinted is of type BigInt and needs to be converted to integer */}
			{numOfTokensMinted != undefined ? parseInt(numOfTokensMinted) : ""}
			/10 have been minted
		</div>

		<div className="mt-1">
			{account ? (
				<button
					className="bg-blue-500 px-4 py-2 font-sans rounded-md disabled:cursor-not-allowed disabled:bg-blue-900"
					disabled={isLoading}
					onClick={mintToken}
				>
					{isLoading ? "Loading..." : "Mint!"}
				</button>
			) : (
				<ConnectButton />
			)}
		</div>
		</div>

		<div className="flex border-2 w-[40%]">
			<img src={"/learnweb3punks.png"} />
		</div>
	</div>

	<footer className="absolute bottom-0 w-full text-center mb-4 tracking-wider">
		Made with &#10084; by LW3Punks
	</footer>
	</main>
	);
}


