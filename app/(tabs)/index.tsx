import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { Play, Eye, Zap } from 'lucide-react-native';
import { fetchVideos, formatViews, formatDate, CHANNEL_INFO } from '@/lib/youtube';
import { VideoItem } from '@/types/video';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Theme';

export default function HomeScreen() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchVideos();
      setVideos(data);
    } catch (e) {
      setError('Unable to load videos. Pull down to try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadVideos();
  }, [loadVideos]);

  const renderLatestVideo = () => {
    if (videos.length === 0) return null;
    const latest = videos[0];

    return (
      <TouchableOpacity
        style={styles.featuredCard}
        activeOpacity={0.85}
        onPress={() => router.push({ pathname: '/player/[videoId]', params: { videoId: latest.videoId, title: latest.title } })}>
        <Image source={{ uri: latest.thumbnail }} style={styles.featuredThumbnail} />
        <View style={styles.featuredOverlay}>
          <View style={styles.playButton}>
            <Play size={28} color="#fff" fill="#fff" strokeWidth={1} />
          </View>
        </View>
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredLabel}>Latest Video</Text>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {latest.title}
          </Text>
          <View style={styles.featuredMeta}>
            <View style={styles.metaItem}>
              <Eye size={13} color={Colors.dark[400]} strokeWidth={2} />
              <Text style={styles.metaText}>{formatViews(latest.views)}</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaText}>{formatDate(latest.publishedDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecentItem = ({ item, index }: { item: VideoItem; index: number }) => (
    <TouchableOpacity
      style={styles.recentCard}
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/player/[videoId]', params: { videoId: item.videoId, title: item.title } })}>
      <Image source={{ uri: item.thumbnail }} style={styles.recentThumbnail} />
      <View style={styles.recentInfo}>
        <Text style={styles.recentTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.recentMeta}>
          <View style={styles.metaRow}>
            <Eye size={11} color={Colors.dark[400]} strokeWidth={2} />
            <Text style={styles.recentMetaText}>{formatViews(item.views)}</Text>
          </View>
          {item.isShort && (
            <View style={styles.shortBadge}>
              <Zap size={10} color={Colors.primary[500]} strokeWidth={2.5} />
              <Text style={styles.shortBadgeText}>Short</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  if (error && videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadVideos}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos.slice(1)}
        keyExtractor={(item) => item.videoId}
        ListHeaderComponent={
          <View>
            <View style={styles.headerSection}>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.channelName}>{CHANNEL_INFO.name}</Text>
            </View>
            {renderLatestVideo()}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Uploads</Text>
              <Text style={styles.sectionCount}>{videos.length - 1} videos</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No additional videos yet.</Text>
          </View>
        }
        renderItem={renderRecentItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[500]} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark[950],
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.dark[950],
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  listContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerSection: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.md,
    color: Colors.dark[400],
    marginBottom: 2,
  },
  channelName: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.xxxl,
    color: '#fff',
  },
  featuredCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.dark[800],
    marginBottom: Spacing.lg,
  },
  featuredThumbnail: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  featuredInfo: {
    padding: Spacing.md,
  },
  featuredLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: FontSize.xs,
    color: Colors.primary[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  featuredTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.lg,
    color: '#fff',
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.xs,
    color: Colors.dark[400],
  },
  dot: {
    color: Colors.dark[600],
    fontSize: FontSize.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.xl,
    color: '#fff',
  },
  sectionCount: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.sm,
    color: Colors.dark[400],
  },
  recentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark[800],
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  recentThumbnail: {
    width: 140,
    height: 80,
    resizeMode: 'cover',
  },
  recentInfo: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'center',
  },
  recentTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: FontSize.sm,
    color: '#fff',
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentMetaText: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.xs,
    color: Colors.dark[400],
  },
  shortBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  shortBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: Colors.primary[500],
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.md,
    color: Colors.dark[400],
    marginTop: Spacing.md,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.md,
    color: Colors.dark[400],
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: FontSize.md,
    color: '#fff',
  },
  emptyList: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.md,
    color: Colors.dark[400],
  },
});
