import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { DetectionEvent, FeatureSummary, TrafficClassification, UserProfile } from '../backend';

// ---- User Profile ----

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ---- Detection History ----

export function useGetDetectionHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DetectionEvent[]>({
    queryKey: ['detectionHistory'],
    queryFn: async () => {
      if (!actor) return [];
      const history = await actor.getDetectionHistory();
      // Sort descending by timestamp (most recent first)
      return [...history].sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

export function useDetectTraffic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<TrafficClassification, Error, FeatureSummary>({
    mutationFn: async (features: FeatureSummary) => {
      if (!actor) throw new Error('Actor not available');
      return actor.detectTraffic(features);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detectionHistory'] });
    },
  });
}

export function useClearDetectionHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearDetectionHistory();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detectionHistory'] });
    },
  });
}
