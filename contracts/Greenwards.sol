// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IBeGreen {
    function resetAndUpdateLogic(address user) external;

    function ownerOf(uint256 tokenId) external view returns (address);

    function totalSupply() external view returns (uint256);

    function accumulatedWaste(
        address user,
        uint256 index
    ) external view returns (uint256);

    function totalAccumulatedWaste() external view returns (uint256);

    function resetTotalAccumulatedWaste() external;
}

contract Greenwards is ERC20, Ownable {
    constructor() ERC20("Greenwards", "GWD") {}

    address public beGreen;

    function mint(uint256 amount) public onlyOwner {
        console.log("test sm1");
        IBeGreen beGreenInterface = IBeGreen(beGreen);
        uint256 totalNFTHolders = beGreenInterface.totalSupply();
        uint256 totalAccumulatedWaste = beGreenInterface
            .totalAccumulatedWaste();

        console.log("test sm2");
        for (uint256 i = 0; i < totalNFTHolders; ++i) {
            address holder = beGreenInterface.ownerOf(i);
            uint256 accumulated = beGreenInterface.accumulatedWaste(holder, 0);
            _mint(holder, (amount * accumulated) / totalAccumulatedWaste);
            beGreenInterface.resetAndUpdateLogic(holder);
        }

        beGreenInterface.resetTotalAccumulatedWaste();
    }

    function setBeGreen(address _beGreen) public onlyOwner {
        beGreen = _beGreen;
    }
}
