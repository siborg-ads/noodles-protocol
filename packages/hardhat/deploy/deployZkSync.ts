import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  if (!process.env.DEPLOYER_PRIVATE_KEY) {
    throw new Error("Please set your DEPLOYER_PRIVATE_KEY in a .env file");
  }
  const wallet = new Wallet(process.env.DEPLOYER_PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);
  const ethProvider = deployer.ethWallet.provider;
  if (!ethProvider) {
    throw new Error("ethProvider is not set");
  }
  const ethWalletAddr = deployer.ethWallet.address;
  console.log("Ready to deploy to ", hre.network.name, "with deployer : ", ethWalletAddr);

  const creditsArtifact = await deployer.loadArtifact("VisibilityCredits");
  console.log("Deploying VisibilityCredits...");
  const creditsContract = await deployer.deploy(creditsArtifact, [ethWalletAddr, ethWalletAddr]);
  const creditsContractAddr = await creditsContract.getAddress();
  console.log("VisibilityCredits deployed to:", creditsContractAddr);

  const servicesArtifact = await deployer.loadArtifact("VisibilityServices");
  console.log("Deploying VisibilityServices...");
  const servicesContract = await deployer.deploy(servicesArtifact, [creditsContractAddr, ethWalletAddr]);
  const servicesContractAddr = await servicesContract.getAddress();
  console.log("VisibilityServices deployed to:", servicesContractAddr);
}
