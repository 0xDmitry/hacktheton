message RegisterLevel {
    name: String;
    factory: Address;
}

message UnregisterLevel {
    name: String;
}

message CreateLevel {
    name: String;
}

message CreatePlayerLevel {
    name: String;
    factory: Address;
}

message DeployLevel {
    player: Address;
}

message LevelDeployed {
    address: Address;
}

message CheckLevel {
    name: String;
}

message PlayerLevelCompleted {
    player: Address;
    name: String;
}