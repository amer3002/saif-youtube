import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { Play, Eye, Heart, Zap } from 'lucide-react-native';
import { fetchVideos, formatViews, formatDate, CHANNEL_INFO } from '@/lib/youtube';
import { VideoItem } from '@/types/video';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Theme';

export default function VideosScreen() {
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

  const renderVideoCard = ({ item }: { item: VideoItem }) => (
    <TouchableOpacity
      style={styles.videoCard}
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/player/[videoId]', params: { videoId: item.videoId, title: item.title } })}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.thumbnailOverlay}>
          <View style={styles.playButtonSmall}>
            <Play size={18} color="#fff" fill="#fff" strokeWidth={1} />
          </View>
        </View>
        {item.isShort && (
          <View style={styles.shortBadgeLarge}>
            <Zap size={12} color={Colors.primary[500]} strokeWidth={2.5} />
            <Text style={styles.shortBadgeLargeText}>Short</Text>
          </View>
        )}
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.videoMeta}>
          <View style={styles.metaRow}>
            <Eye size={13} color={Colors.dark[400]} strokeWidth={2} />
            <Text style={styles.metaText}>{formatViews(item.views)}</Text>
          </View>
          {item.likes > 0 && (
            <View style={styles.metaRow}>
              <Heart size={13} color={Colors.dark[400]} strokeWidth={2} />
              <Text style={styles.metaText}>{item.likes}</Text>
            </View>
          )}
          <Text style={styles.metaText}>{formatDate(item.publishedDate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
        <Text style={styles.loadingText}>Loading all videos...</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Videos</Text>
        <Text style={styles.headerSubtitle}>{videos.length} videos from {CHANNEL_INFO.handle}</Text>
      </View>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.videoId}
        renderItem={renderVideoCard}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[500]} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
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
  header: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.xxxl,
    color: '#fff',
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.sm,
    color: Colors.dark[400],
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  columnWrapper: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  videoCard: {
    flex: 1,
    backgroundColor: Colors.dark[800],
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortBadgeLarge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  shortBadgeLargeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: Colors.primary[500],
  },
  videoInfo: {
    padding: Spacing.sm,
  },
  videoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: FontSize.sm,
    color: '#fff',
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.xs,
    color: Colors.dark[400],
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
});
