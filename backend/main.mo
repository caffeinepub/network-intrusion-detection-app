import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type AttackType = {
    #normal;
    #dos;
    #probe;
    #r2l;
    #u2r;
  };

  module AttackType {
    public func toText(attackType : AttackType) : Text {
      switch (attackType) {
        case (#dos) { "DoS" };
        case (#probe) { "Probe" };
        case (#r2l) { "R2L" };
        case (#u2r) { "U2R" };
        case (#normal) { "Normal" };
      };
    };

    public func compare(a1 : AttackType, a2 : AttackType) : Order.Order {
      let orderMap = [
        (#normal, 0),
        (#dos, 1),
        (#probe, 2),
        (#r2l, 3),
        (#u2r, 4),
      ];
      func attackTypeToIndex(a : AttackType) : Nat {
        switch (orderMap.find(func((at, _)) { at == a })) {
          case (?(_, index)) { index };
          case (null) { 0 };
        };
      };
      Nat.compare(attackTypeToIndex(a1), attackTypeToIndex(a2));
    };
  };

  type RiskLevel = {
    #low;
    #medium;
    #high;
    #critical;
  };

  module RiskLevel {
    public func toText(riskLevel : RiskLevel) : Text {
      switch (riskLevel) {
        case (#low) { "Low" };
        case (#medium) { "Medium" };
        case (#high) { "High" };
        case (#critical) { "Critical" };
      };
    };

    public func compare(r1 : RiskLevel, r2 : RiskLevel) : Order.Order {
      let riskLevelsOrder = [
        (#low, 0),
        (#medium, 1),
        (#high, 2),
        (#critical, 3),
      ];
      func riskLevelToIndex(r : RiskLevel) : Nat {
        switch (riskLevelsOrder.find(func((rl, _)) { rl == r })) {
          case (?(_, index)) { index };
          case (null) { 0 };
        };
      };
      Nat.compare(riskLevelToIndex(r1), riskLevelToIndex(r2));
    };
  };

  public type FeatureSummary = {
    packets : Nat;
    bytes : Nat;
    duration : Nat;
    sourcePortRange : Nat;
    destinationPortRange : Nat;
    protocolTcpRatio : Float;
    protocolUdpRatio : Float;
    protocolIcmpRatio : Float;
  };

  module FeatureSummary {
    public func toText(feature : FeatureSummary) : Text {
      "{\"packets\":" # feature.packets.toText() #
      ",\"bytes\":" # feature.bytes.toText() #
      ",\"duration\":" # feature.duration.toText() #
      ",\"sourcePortRange\":" # feature.sourcePortRange.toText() #
      ",\"destinationPortRange\":" # feature.destinationPortRange.toText() #
      ",\"protocolTcpRatio\":" # feature.protocolTcpRatio.toText() #
      ",\"protocolUdpRatio\":" # feature.protocolUdpRatio.toText() #
      ",\"protocolIcmpRatio\":" # feature.protocolIcmpRatio.toText() # "}";
    };

    public func compareByPackets(a : FeatureSummary, b : FeatureSummary) : Order.Order {
      Nat.compare(a.packets, b.packets);
    };

    public func compareByBytes(a : FeatureSummary, b : FeatureSummary) : Order.Order {
      Nat.compare(a.bytes, b.bytes);
    };

    public func compareByDuration(a : FeatureSummary, b : FeatureSummary) : Order.Order {
      Nat.compare(a.duration, b.duration);
    };

    public func compareBySourcePortRange(a : FeatureSummary, b : FeatureSummary) : Order.Order {
      Nat.compare(a.sourcePortRange, b.sourcePortRange);
    };

    public func compareByDestinationPortRange(a : FeatureSummary, b : FeatureSummary) : Order.Order {
      Nat.compare(a.destinationPortRange, b.destinationPortRange);
    };

    public func compareByTcpRatio(a : FeatureSummary, b : FeatureSummary) : Order.Order {
      Float.compare(a.protocolTcpRatio, b.protocolTcpRatio);
    };

    public func compareByUdpRatio(a : FeatureSummary, b : FeatureSummary) : Order.Order {
      Float.compare(a.protocolUdpRatio, b.protocolUdpRatio);
    };

    public func compareByIcmpRatio(a : FeatureSummary, b : FeatureSummary) : Order.Order {
      Float.compare(a.protocolIcmpRatio, b.protocolIcmpRatio);
    };
  };

  public type TrafficClassification = {
    attackType : AttackType;
    riskLevel : RiskLevel;
  };

  module TrafficClassification {
    public func toText(classification : TrafficClassification) : Text {
      "{\"attackType\":\"" # AttackType.toText(classification.attackType) # "\",\"riskLevel\":\"" # RiskLevel.toText(classification.riskLevel) # "\"}";
    };
  };

  public type DetectionEvent = {
    timestamp : Time.Time;
    featureSummary : FeatureSummary;
    classification : TrafficClassification;
  };

  module DetectionEvent {
    public func compareByTimestamp(a : DetectionEvent, b : DetectionEvent) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  // Include authentication system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profiles storage
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Persistent detection history (list of events)
  let detectionHistory = List.empty<DetectionEvent>();

  // Simulate ML-based traffic classification logic
  func simulateTrafficClassification(features : FeatureSummary) : TrafficClassification {
    // DoS Attack Patterns
    if (features.packets > 10000 and features.duration < 10) {
      return {
        attackType = #dos;
        riskLevel = #high;
      };
    };

    if (features.protocolUdpRatio > 0.7) {
      return { attackType = #dos; riskLevel = #medium };
    };

    if (features.protocolIcmpRatio > 0.8) {
      return { attackType = #dos; riskLevel = #medium };
    };

    // Probe Attack Patterns (Reconnaissance)
    if (features.destinationPortRange >= 50) {
      return {
        attackType = #probe;
        riskLevel = #medium;
      };
    };

    if (features.sourcePortRange >= 25) {
      return { attackType = #probe; riskLevel = #medium };
    };

    // R2L & U2R Attack Patterns
    if (features.packets > 600 and features.duration > 1200) {
      return {
        attackType = #r2l;
        riskLevel = #medium;
      };
    };

    if (features.protocolTcpRatio > 0.8) {
      return {
        attackType = #u2r;
        riskLevel = #medium;
      };
    };

    // Low Packets & Short Duration: Likely Benign
    if (features.packets < 500 and features.duration < 120) {
      return {
        attackType = #normal;
        riskLevel = #low;
      };
    };

    // Default to normal if no pattern matches
    { attackType = #normal; riskLevel = #low };
  };

  // --- User Profile Functions ---

  // Get the caller's own user profile (requires authenticated user)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  // Get another user's profile (caller can view own profile; admins can view any profile)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Save the caller's own user profile (requires authenticated user)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  // --- Detection Functions ---

  // Detect traffic and store detection event in history
  public shared ({ caller }) func detectTraffic(features : FeatureSummary) : async TrafficClassification {
    // Authenticate user
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can perform detection");
    };

    let classification = simulateTrafficClassification(features);

    let detectionEvent : DetectionEvent = {
      timestamp = Time.now();
      featureSummary = features;
      classification;
    };

    // Add event to history
    detectionHistory.add(detectionEvent);

    classification;
  };

  // Get detection history by risk level
  public query ({ caller }) func getDetectionHistoryByRiskLevel() : async [RiskLevel] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.classification.riskLevel }).toArray().sort();
  };

  // Get detection history by attack type
  public query ({ caller }) func getDetectionHistoryByAttackType() : async [AttackType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.classification.attackType }).toArray().sort();
  };

  // Get detection history sorted by timestamp
  public query ({ caller }) func getDetectionHistory() : async [DetectionEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };
    detectionHistory.toArray().sort(DetectionEvent.compareByTimestamp);
  };

  // Get detection history sorted by packets
  public query ({ caller }) func getDetectionHistoryByPackets() : async [FeatureSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.featureSummary }).toArray().sort(FeatureSummary.compareByPackets);
  };

  // Get detection history sorted by bytes
  public query ({ caller }) func getDetectionHistoryByBytes() : async [FeatureSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.featureSummary }).toArray().sort(FeatureSummary.compareByBytes);
  };

  // Get detection history sorted by duration
  public query ({ caller }) func getDetectionHistoryByDuration() : async [FeatureSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.featureSummary }).toArray().sort(FeatureSummary.compareByDuration);
  };

  // Get detection history sorted by source port range
  public query ({ caller }) func getDetectionHistoryBySourcePortRange() : async [FeatureSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.featureSummary }).toArray().sort(FeatureSummary.compareBySourcePortRange);
  };

  // Get detection history sorted by destination port range
  public query ({ caller }) func getDetectionHistoryByDestinationPortRange() : async [FeatureSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.featureSummary }).toArray().sort(FeatureSummary.compareByDestinationPortRange);
  };

  // Get detection history sorted by TCP ratio
  public query ({ caller }) func getDetectionHistoryByTcpRatio() : async [FeatureSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.featureSummary }).toArray().sort(FeatureSummary.compareByTcpRatio);
  };

  // Get detection history sorted by UDP ratio
  public query ({ caller }) func getDetectionHistoryByUdpRatio() : async [FeatureSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.featureSummary }).toArray().sort(FeatureSummary.compareByUdpRatio);
  };

  // Get detection history sorted by ICMP ratio
  public query ({ caller }) func getDetectionHistoryByIcmpRatio() : async [FeatureSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.featureSummary }).toArray().sort(FeatureSummary.compareByIcmpRatio);
  };

  // Get detection history timestamps
  public query ({ caller }) func getDetectionHistoryTimestamps() : async [Time.Time] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only signed-in users can access history");
    };

    detectionHistory.values().map(func(event) { event.timestamp }).toArray();
  };

  // Clear detection history (admin only)
  public shared ({ caller }) func clearDetectionHistory() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear history");
    };
    detectionHistory.clear();
  };
};
