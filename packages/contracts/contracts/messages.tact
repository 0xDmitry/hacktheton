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
    name: String;
    address: Address;
}

message CheckLevel {
    name: String;
}

message CheckLevelResult {
    name: String;
    completed: Bool;
}

message ResponseStats {
    levelsCompleted: Int;
}