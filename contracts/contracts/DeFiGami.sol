// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IAirDAO {
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function getReward() external;
}

contract AirDAODeFiGame is Ownable, ReentrancyGuard, Pausable {
    // AirDAO token contract
    IERC20 public ambToken;
    // AirDAO staking contract
    IAirDAO public airDAO;

    // Structs
    struct Task {
        string name;
        uint256 points;
        uint256 requiredAmount;
        bool isActive;
        TaskType taskType;
    }

    struct UserInfo {
        uint256 totalPoints;
        uint256 stakedAmount;
        uint256 lastStakeTime;
        mapping(uint256 => bool) completedTasks;
    }

    // Enums
    enum TaskType {
        STAKE,
        GOVERNANCE,
        LIQUIDITY,
        HOLD
    }

    // State variables
    mapping(address => UserInfo) public userInfo;
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;
    uint256 public totalUsers;
    uint256 public totalPointsAwarded;

    // Events
    event TaskCompleted(address indexed user, uint256 taskId, uint256 points);
    event PointsAwarded(address indexed user, uint256 points);
    event NewStake(address indexed user, uint256 amount);
    event UserJoined(address indexed user);

    // Constants
    uint256 public constant MIN_STAKE = 100 * 1e18; // 100 AMB
    uint256 public constant HOLDING_PERIOD = 7 days;

    constructor(address _ambToken, address _airDAO) Ownable(msg.sender) {
        ambToken = IERC20(_ambToken);
        airDAO = IAirDAO(_airDAO);

        // Initialize default tasks
        _addTask("Stake 100 AMB", 50, MIN_STAKE, TaskType.STAKE);
        _addTask("Participate in Governance", 75, 0, TaskType.GOVERNANCE);
        _addTask("Provide Liquidity", 100, MIN_STAKE, TaskType.LIQUIDITY);
        _addTask("Hold AMB for 7 days", 150, MIN_STAKE, TaskType.HOLD);
    }

    // Task Management
    function _addTask(
        string memory name,
        uint256 points,
        uint256 requiredAmount,
        TaskType taskType
    ) internal {
        taskCount++;
        tasks[taskCount] = Task(name, points, requiredAmount, true, taskType);
    }

    // Staking Integration
    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(amount >= MIN_STAKE, "Below minimum stake amount");

        // Transfer AMB tokens to this contract
        require(
            ambToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        // Approve tokens for AirDAO staking
        ambToken.approve(address(airDAO), amount);

        // Stake in AirDAO
        airDAO.stake(amount);

        // Update user info
        UserInfo storage user = userInfo[msg.sender];
        if (user.stakedAmount == 0) {
            totalUsers++;
            emit UserJoined(msg.sender);
        }

        user.stakedAmount += amount;
        user.lastStakeTime = block.timestamp;

        emit NewStake(msg.sender, amount);

        // Check if stake task can be completed
        _checkAndCompleteTask(1, msg.sender);
    }

    // Task Completion
    function completeTask(uint256 taskId) external nonReentrant whenNotPaused {
        require(taskId > 0 && taskId <= taskCount, "Invalid task");
        require(tasks[taskId].isActive, "Task not active");
        require(
            !userInfo[msg.sender].completedTasks[taskId],
            "Task already completed"
        );

        Task storage task = tasks[taskId];
        UserInfo storage user = userInfo[msg.sender];

        // Verify task requirements
        if (task.taskType == TaskType.STAKE) {
            require(user.stakedAmount >= task.requiredAmount, "Insufficient stake");
        } else if (task.taskType == TaskType.HOLD) {
            require(
                user.stakedAmount >= task.requiredAmount &&
                    block.timestamp >= user.lastStakeTime + HOLDING_PERIOD,
                "Holding period not met"
            );
        } else if (task.taskType == TaskType.GOVERNANCE) {
            // Add logic to verify governance participation.  This is a placeholder.
            // You would need an external mechanism (e.g., an oracle or off-chain verification)
            // to confirm participation in governance.
        } else if (task.taskType == TaskType.LIQUIDITY) {
             // Add logic to verify liquidity provision. This may involve checking balances in
            // a liquidity pool or interacting with a DEX contract.
        }


        // Mark task as completed and award points
        user.completedTasks[taskId] = true;
        user.totalPoints += task.points;
        totalPointsAwarded += task.points;

        emit TaskCompleted(msg.sender, taskId, task.points);
        emit PointsAwarded(msg.sender, task.points);
    }

    // Internal task check
    function _checkAndCompleteTask(uint256 taskId, address user) internal {
        if (
            !userInfo[user].completedTasks[taskId] &&
            userInfo[user].stakedAmount >= tasks[taskId].requiredAmount
        ) {
            userInfo[user].completedTasks[taskId] = true;
            userInfo[user].totalPoints += tasks[taskId].points;
            totalPointsAwarded += tasks[taskId].points;

            emit TaskCompleted(user, taskId, tasks[taskId].points);
            emit PointsAwarded(user, tasks[taskId].points);
        }
    }

    // View Functions
    function getUserPoints(address user) external view returns (uint256) {
        return userInfo[user].totalPoints;
    }

    function getTask(uint256 taskId) external view returns (Task memory) {
        require(taskId > 0 && taskId <= taskCount, "Invalid task");
        return tasks[taskId];
    }

    function isTaskCompleted(address user, uint256 taskId)
        external
        view
        returns (bool)
    {
        return userInfo[user].completedTasks[taskId];
    }

    // Admin Functions
    function addNewTask(
        string calldata name,
        uint256 points,
        uint256 requiredAmount,
        TaskType taskType
    ) external onlyOwner {
        _addTask(name, points, requiredAmount, taskType);
    }

    function setTaskActive(uint256 taskId, bool isActive) external onlyOwner {
        require(taskId > 0 && taskId <= taskCount, "Invalid task");
        tasks[taskId].isActive = isActive;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency Functions
    function emergencyWithdraw() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(user.stakedAmount > 0, "No stake to withdraw");

        uint256 amount = user.stakedAmount;
        user.stakedAmount = 0;

        // Unstake from AirDAO
        airDAO.unstake(amount);

        // Transfer tokens back to user
        require(ambToken.transfer(msg.sender, amount), "Transfer failed");
    }
}