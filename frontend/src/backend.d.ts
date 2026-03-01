import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface TrafficClassification {
    attackType: AttackType;
    riskLevel: RiskLevel;
}
export interface DetectionEvent {
    featureSummary: FeatureSummary;
    timestamp: Time;
    classification: TrafficClassification;
}
export interface FeatureSummary {
    duration: bigint;
    destinationPortRange: bigint;
    packets: bigint;
    sourcePortRange: bigint;
    protocolTcpRatio: number;
    protocolIcmpRatio: number;
    protocolUdpRatio: number;
    bytes: bigint;
}
export interface UserProfile {
    name: string;
}
export enum AttackType {
    dos = "dos",
    r2l = "r2l",
    u2r = "u2r",
    normal = "normal",
    probe = "probe"
}
export enum RiskLevel {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearDetectionHistory(): Promise<void>;
    detectTraffic(features: FeatureSummary): Promise<TrafficClassification>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDetectionHistory(): Promise<Array<DetectionEvent>>;
    getDetectionHistoryByAttackType(): Promise<Array<AttackType>>;
    getDetectionHistoryByBytes(): Promise<Array<FeatureSummary>>;
    getDetectionHistoryByDestinationPortRange(): Promise<Array<FeatureSummary>>;
    getDetectionHistoryByDuration(): Promise<Array<FeatureSummary>>;
    getDetectionHistoryByIcmpRatio(): Promise<Array<FeatureSummary>>;
    getDetectionHistoryByPackets(): Promise<Array<FeatureSummary>>;
    getDetectionHistoryByRiskLevel(): Promise<Array<RiskLevel>>;
    getDetectionHistoryBySourcePortRange(): Promise<Array<FeatureSummary>>;
    getDetectionHistoryByTcpRatio(): Promise<Array<FeatureSummary>>;
    getDetectionHistoryByUdpRatio(): Promise<Array<FeatureSummary>>;
    getDetectionHistoryTimestamps(): Promise<Array<Time>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
