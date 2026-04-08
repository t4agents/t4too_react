import { StyleSheet } from 'react-native';

export const getWeatherScreenStyles = (currentTheme: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: currentTheme.spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: currentTheme.colors.text,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: currentTheme.spacing.xs,
    },
    locationText: {
        fontSize: 14,
        color: currentTheme.colors.textSecondary,
        marginLeft: currentTheme.spacing.xs,
    },
    content: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: currentTheme.spacing.xl,
    },
    errorText: {
        fontSize: 16,
        color: currentTheme.colors.error,
        textAlign: 'center',
        marginBottom: currentTheme.spacing.md,
    },
    retryButton: {
        backgroundColor: currentTheme.colors.primary,
        paddingHorizontal: currentTheme.spacing.lg,
        paddingVertical: currentTheme.spacing.md,
        borderRadius: currentTheme.borderRadius.md,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.md,
    },
    forecastContainer: {
        padding: currentTheme.spacing.md,
    },
    forecastTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: currentTheme.colors.text,
        marginBottom: currentTheme.spacing.md,
    },
    forecastItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: currentTheme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.colors.border,
    },
    forecastDate: {
        fontSize: 16,
        color: currentTheme.colors.text,
        flex: 1,
    },
    forecastWeather: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    forecastIcon: {
        fontSize: 20,
        marginRight: currentTheme.spacing.sm,
    },
    forecastDescription: {
        fontSize: 14,
        color: currentTheme.colors.textSecondary,
        flex: 1,
    },
    forecastTemp: {
        fontSize: 16,
        fontWeight: '600',
        color: currentTheme.colors.text,
    },
});

export const getSettingsScreenStyles = (currentTheme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentTheme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: currentTheme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.colors.border,
    },
    headerIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: currentTheme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: currentTheme.spacing.sm,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: currentTheme.colors.text,
    },
    content: {
        flex: 1,
    },
    section: {
        marginVertical: currentTheme.spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: currentTheme.colors.text,
        marginBottom: currentTheme.spacing.sm,
        paddingHorizontal: currentTheme.spacing.md,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: currentTheme.spacing.md,
        paddingHorizontal: currentTheme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.colors.border,
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        color: currentTheme.colors.text,
        marginBottom: currentTheme.spacing.xs,
    },
    settingDescription: {
        fontSize: 14,
        color: currentTheme.colors.textSecondary,
    },
    unitsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pillGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: currentTheme.spacing.sm,
    },
    pillButton: {
        paddingHorizontal: currentTheme.spacing.md,
        paddingVertical: currentTheme.spacing.sm,
        borderRadius: currentTheme.borderRadius.sm,
        marginRight: currentTheme.spacing.sm,
        marginBottom: currentTheme.spacing.sm,
    },
    unitButton: {
        paddingHorizontal: currentTheme.spacing.md,
        paddingVertical: currentTheme.spacing.sm,
        borderRadius: currentTheme.borderRadius.sm,
        marginLeft: currentTheme.spacing.sm,
    },
    unitButtonActive: {
        backgroundColor: currentTheme.colors.primary,
    },
    unitButtonInactive: {
        backgroundColor: currentTheme.colors.surface,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    unitButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    unitButtonTextActive: {
        color: '#fff',
    },
    unitButtonTextInactive: {
        color: currentTheme.colors.textSecondary,
    },
    dangerSection: {
        marginTop: currentTheme.spacing.xl,
    },
    dangerButton: {
        backgroundColor: currentTheme.colors.error,
        marginHorizontal: currentTheme.spacing.md,
        paddingVertical: currentTheme.spacing.md,
        borderRadius: currentTheme.borderRadius.md,
        alignItems: 'center',
    },
    dangerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export const getStormListScreenStyles = (currentTheme: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: currentTheme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: currentTheme.colors.text,
    },
    addButton: {
        backgroundColor: currentTheme.colors.primary,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: currentTheme.spacing.xl,
    },
    emptyIcon: {
        fontSize: 64,
        color: currentTheme.colors.textSecondary,
        marginBottom: currentTheme.spacing.md,
    },
    emptyText: {
        fontSize: 18,
        color: currentTheme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: currentTheme.spacing.md,
    },
    emptySubtext: {
        fontSize: 14,
        color: currentTheme.colors.textSecondary,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: currentTheme.spacing.xl,
    },
    errorText: {
        fontSize: 16,
        color: currentTheme.colors.error,
        textAlign: 'center',
        marginBottom: currentTheme.spacing.md,
    },
    retryButton: {
        backgroundColor: currentTheme.colors.primary,
        paddingHorizontal: currentTheme.spacing.lg,
        paddingVertical: currentTheme.spacing.md,
        borderRadius: currentTheme.borderRadius.md,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.md,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: currentTheme.spacing.md,
        backgroundColor: currentTheme.colors.surface,
        margin: currentTheme.spacing.sm,
        borderRadius: currentTheme.borderRadius.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: currentTheme.colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.xs,
    },
});

export const getStormDetailScreenStyles = (currentTheme: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: currentTheme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.colors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: currentTheme.colors.text,
    },
    backButton: {
        color: currentTheme.colors.primary,
        fontSize: 16,
    },
    content: {
        flex: 1,
    },
    photoContainer: {
        width: '100%',
        height: 300,
        backgroundColor: currentTheme.colors.surface,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: currentTheme.spacing.md,
    },
    stormHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.md,
    },
    stormType: {
        fontSize: 24,
        fontWeight: 'bold',
        color: currentTheme.colors.text,
        marginRight: currentTheme.spacing.sm,
    },
    stormIcon: {
        fontSize: 28,
    },
    date: {
        fontSize: 16,
        color: currentTheme.colors.textSecondary,
        marginBottom: currentTheme.spacing.lg,
    },
    section: {
        marginBottom: currentTheme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: currentTheme.colors.text,
        marginBottom: currentTheme.spacing.md,
    },
    weatherCard: {
        backgroundColor: currentTheme.colors.surface,
        padding: currentTheme.spacing.md,
        borderRadius: currentTheme.borderRadius.md,
        marginBottom: currentTheme.spacing.md,
    },
    weatherRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: currentTheme.spacing.sm,
    },
    weatherLabel: {
        fontSize: 14,
        color: currentTheme.colors.textSecondary,
    },
    weatherValue: {
        fontSize: 14,
        fontWeight: '600',
        color: currentTheme.colors.text,
    },
    locationCard: {
        backgroundColor: currentTheme.colors.surface,
        padding: currentTheme.spacing.md,
        borderRadius: currentTheme.borderRadius.md,
        marginBottom: currentTheme.spacing.md,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.xs,
    },
    locationIcon: {
        marginRight: currentTheme.spacing.xs,
    },
    locationText: {
        fontSize: 14,
        color: currentTheme.colors.text,
    },
    notesCard: {
        backgroundColor: currentTheme.colors.surface,
        padding: currentTheme.spacing.md,
        borderRadius: currentTheme.borderRadius.md,
    },
    notesText: {
        fontSize: 14,
        color: currentTheme.colors.text,
        lineHeight: 20,
    },
    noNotes: {
        fontSize: 14,
        color: currentTheme.colors.textSecondary,
        fontStyle: 'italic',
    },
    metadataCard: {
        backgroundColor: currentTheme.colors.surface,
        padding: currentTheme.spacing.md,
        borderRadius: currentTheme.borderRadius.md,
        marginTop: currentTheme.spacing.md,
    },
    metadataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: currentTheme.spacing.xs,
    },
    metadataLabel: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
    },
    metadataValue: {
        fontSize: 12,
        color: currentTheme.colors.text,
    },
});

export const getCaptureStormScreenStyles = (currentTheme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentTheme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: currentTheme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: currentTheme.colors.text,
    },
    cancelButton: {
        color: currentTheme.colors.primary,
        fontSize: 16,
    },
    content: {
        flex: 1,
        padding: currentTheme.spacing.md,
    },
    photoSection: {
        marginBottom: currentTheme.spacing.lg,
    },
    photoContainer: {
        width: '100%',
        height: 200,
        backgroundColor: currentTheme.colors.surface,
        borderRadius: currentTheme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.md,
        overflow: 'hidden',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        fontSize: 48,
        color: currentTheme.colors.textSecondary,
        marginBottom: currentTheme.spacing.sm,
    },
    photoText: {
        fontSize: 16,
        color: currentTheme.colors.textSecondary,
        textAlign: 'center',
    },
    photoButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    photoButton: {
        backgroundColor: currentTheme.colors.primary,
        paddingHorizontal: currentTheme.spacing.lg,
        paddingVertical: currentTheme.spacing.md,
        borderRadius: currentTheme.borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    photoButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: currentTheme.spacing.xs,
    },
    formSection: {
        marginBottom: currentTheme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: currentTheme.colors.text,
        marginBottom: currentTheme.spacing.md,
    },
    pickerContainer: {
        backgroundColor: currentTheme.colors.surface,
        borderRadius: currentTheme.borderRadius.md,
        marginBottom: currentTheme.spacing.md,
    },
    picker: {
        color: currentTheme.colors.text,
    },
    inputContainer: {
        backgroundColor: currentTheme.colors.surface,
        borderRadius: currentTheme.borderRadius.md,
        marginBottom: currentTheme.spacing.md,
    },
    textInput: {
        padding: currentTheme.spacing.md,
        color: currentTheme.colors.text,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    weatherInfo: {
        backgroundColor: currentTheme.colors.surface,
        padding: currentTheme.spacing.md,
        borderRadius: currentTheme.borderRadius.md,
        marginBottom: currentTheme.spacing.lg,
    },
    weatherRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: currentTheme.spacing.xs,
    },
    weatherLabel: {
        fontSize: 14,
        color: currentTheme.colors.textSecondary,
    },
    weatherValue: {
        fontSize: 14,
        fontWeight: '600',
        color: currentTheme.colors.text,
    },
    saveButton: {
        backgroundColor: currentTheme.colors.success,
        paddingVertical: currentTheme.spacing.md,
        borderRadius: currentTheme.borderRadius.md,
        alignItems: 'center',
        marginTop: currentTheme.spacing.lg,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

export const getWeatherCardStyles = (currentTheme: any) => StyleSheet.create({
    container: {
        borderRadius: currentTheme.borderRadius.lg,
        overflow: 'hidden',
        margin: currentTheme.spacing.md,
    },
    gradient: {
        padding: currentTheme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.lg,
    },
    temperatureContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flex: 1,
    },
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        color: currentTheme.colors.text,
        marginRight: currentTheme.spacing.sm,
    },
    description: {
        fontSize: 16,
        color: currentTheme.colors.textSecondary,
    },
    weatherIcon: {
        fontSize: 48,
    },
    hourlySection: {
        marginTop: currentTheme.spacing.md,
    },
    hourlyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.sm,
    },
    hourlyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: currentTheme.colors.text,
    },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: currentTheme.colors.border,
        borderRadius: currentTheme.borderRadius.sm,
        padding: 2,
    },
    toggleButton: {
        paddingHorizontal: currentTheme.spacing.sm,
        paddingVertical: currentTheme.spacing.xs,
        borderRadius: currentTheme.borderRadius.xs,
    },
    toggleButtonActive: {
        backgroundColor: currentTheme.colors.primary,
    },
    toggleButtonText: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        fontWeight: '500',
    },
    toggleButtonTextActive: {
        color: '#fff',
    },
    // Period-based grid styles
    hourlyGrid: {
        marginTop: currentTheme.spacing.sm,
    },
    periodSection: {
        marginBottom: currentTheme.spacing.lg,
        backgroundColor: currentTheme.colors.background,
        borderRadius: currentTheme.borderRadius.md,
        padding: currentTheme.spacing.md,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    periodHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.md,
        paddingBottom: currentTheme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.colors.border,
    },
    periodIcon: {
        fontSize: 20,
        marginRight: currentTheme.spacing.sm,
    },
    periodLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: currentTheme.colors.text,
        flex: 1,
    },
    periodCount: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        fontStyle: 'italic',
    },
    periodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    periodItem: {
        width: '30%',
        alignItems: 'center',
        paddingVertical: currentTheme.spacing.sm,
        paddingHorizontal: currentTheme.spacing.xs,
        marginBottom: currentTheme.spacing.sm,
        backgroundColor: currentTheme.colors.surface,
        borderRadius: currentTheme.borderRadius.sm,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    periodItemFirst: {
        borderLeftWidth: 3,
        borderLeftColor: currentTheme.colors.primary,
    },
    periodItemLast: {
        borderRightWidth: 3,
        borderRightColor: currentTheme.colors.primary,
    },
    periodTime: {
        fontSize: 11,
        color: currentTheme.colors.textSecondary,
        marginBottom: currentTheme.spacing.xs,
        fontWeight: '500',
    },
    periodWeatherIcon: {
        fontSize: 18,
        marginBottom: currentTheme.spacing.xs,
    },
    periodTemp: {
        fontSize: 13,
        fontWeight: '600',
        color: currentTheme.colors.text,
    },
    periodPrecipitation: {
        fontSize: 9,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.xs,
    },
    hourlyTime: {
        fontSize: 11,
        color: currentTheme.colors.textSecondary,
        marginBottom: 2,
    },
    hourlyIcon: {
        fontSize: 16,
        marginBottom: 2,
    },
    hourlyTemp: {
        fontSize: 12,
        fontWeight: '600',
        color: currentTheme.colors.text,
    },
    hourlyPrecipitation: {
        fontSize: 9,
        color: currentTheme.colors.textSecondary,
        marginTop: 2,
    },
    hourlyGridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: currentTheme.spacing.xs,
        paddingVertical: currentTheme.spacing.xs,
        borderRadius: currentTheme.borderRadius.sm,
    },
    hourlyGridRowMorning: {
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderLeftWidth: 3,
        borderLeftColor: '#FFC107',
    },
    hourlyGridRowAfternoon: {
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderLeftWidth: 3,
        borderLeftColor: '#FF9800',
    },
    hourlyGridRowEvening: {
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        borderLeftWidth: 3,
        borderLeftColor: '#9C27B0',
    },
    hourlyGridItem: {
        width: '12%',
        alignItems: 'center',
        paddingVertical: 1,
        paddingHorizontal: 1,
    },
    // Timeline view styles
    hourlyTimeline: {
        marginTop: currentTheme.spacing.sm,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: currentTheme.spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.colors.border,
    },
    timelineTimeContainer: {
        width: 60,
        alignItems: 'flex-start',
    },
    timelineTime: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        fontWeight: '500',
    },
    timelineContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: currentTheme.spacing.sm,
    },
    timelineIcon: {
        fontSize: 16,
        marginRight: currentTheme.spacing.sm,
    },
    timelineTemp: {
        fontSize: 14,
        fontWeight: '600',
        color: currentTheme.colors.text,
        flex: 1,
    },
    timelinePrecipitation: {
        fontSize: 10,
        color: currentTheme.colors.textSecondary,
        marginLeft: currentTheme.spacing.sm,
    },
    // Compact view styles
    hourlyCompact: {
        marginTop: currentTheme.spacing.sm,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    compactItem: {
        width: '30%',
        alignItems: 'center',
        paddingVertical: currentTheme.spacing.xs,
        marginBottom: currentTheme.spacing.sm,
        backgroundColor: currentTheme.colors.background,
        borderRadius: currentTheme.borderRadius.sm,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    compactTime: {
        fontSize: 10,
        color: currentTheme.colors.textSecondary,
        marginBottom: currentTheme.spacing.xs,
        fontWeight: '500',
    },
    compactIcon: {
        fontSize: 16,
        marginBottom: currentTheme.spacing.xs,
    },
    compactTemp: {
        fontSize: 12,
        fontWeight: '600',
        color: currentTheme.colors.text,
    },
    compactPrecipitation: {
        fontSize: 8,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.xs,
    },
    // Grid layout styles
    gridContainer: {
        flex: 1,
        padding: currentTheme.spacing.sm,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    gridItem: {
        width: '12%', // 8 columns (100% / 8 = 12.5%, but using 12% for spacing)
        marginBottom: currentTheme.spacing.sm,
        minHeight: 200,
    },
});

export const getHomeScreenStyles = (currentTheme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentTheme.colors.background,
    },
    content: {
        padding: currentTheme.spacing.lg,
        paddingBottom: currentTheme.spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: currentTheme.spacing.lg,
    },
    eyebrow: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: currentTheme.colors.textSecondary,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: currentTheme.colors.text,
        marginTop: currentTheme.spacing.xs,
    },
    subtitle: {
        fontSize: 14,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.xs,
        maxWidth: 220,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: currentTheme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    askCard: {
        borderRadius: 22,
        padding: currentTheme.spacing.lg,
        overflow: 'hidden',
        marginBottom: currentTheme.spacing.xl,
    },
    askTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: currentTheme.spacing.xs,
    },
    askSubtitle: {
        fontSize: 14,
        color: '#3F3D3A',
        marginBottom: currentTheme.spacing.md,
    },
    searchBar: {
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        borderRadius: 16,
        paddingHorizontal: currentTheme.spacing.md,
        paddingVertical: currentTheme.spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.md,
    },
    searchIcon: {
        marginRight: currentTheme.spacing.sm,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 13,
        color: currentTheme.colors.textSecondary,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        color: currentTheme.colors.text,
        paddingVertical: 0,
    },
    searchActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchActionIcon: {
        marginLeft: currentTheme.spacing.sm,
    },
    askChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: currentTheme.spacing.xs,
    },
    chip: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingHorizontal: currentTheme.spacing.sm,
        paddingVertical: currentTheme.spacing.xs,
        borderRadius: 999,
        marginRight: currentTheme.spacing.sm,
        marginBottom: currentTheme.spacing.sm,
    },
    chipText: {
        fontSize: 12,
        color: '#3F3D3A',
        fontWeight: '600',
    },
    section: {
        marginBottom: currentTheme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: currentTheme.colors.text,
    },
    sectionLink: {
        fontSize: 13,
        color: currentTheme.colors.primary,
        fontWeight: '600',
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        width: '48%',
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 16,
        padding: currentTheme.spacing.md,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
        marginBottom: currentTheme.spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    actionIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(242, 133, 0, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: currentTheme.spacing.sm,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: currentTheme.colors.text,
    },
    actionSubtitle: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.xs,
    },
    snapshotCard: {
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 18,
        padding: currentTheme.spacing.lg,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    snapshotRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: currentTheme.spacing.md,
    },
    snapshotItem: {
        flex: 1,
    },
    snapshotLabel: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        marginBottom: currentTheme.spacing.xs,
    },
    snapshotValue: {
        fontSize: 16,
        fontWeight: '700',
        color: currentTheme.colors.text,
    },
    snapshotFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: currentTheme.spacing.sm,
    },
    snapshotFooterText: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        fontWeight: '600',
        marginLeft: currentTheme.spacing.xs,
    },
    insightsCard: {
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 18,
        padding: currentTheme.spacing.lg,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    askResult: {
        marginTop: currentTheme.spacing.md,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 14,
        padding: currentTheme.spacing.md,
    },
    askStatusLine: {
        fontSize: 12,
        color: '#5F5B55',
        marginBottom: currentTheme.spacing.xs,
    },
    askAnswer: {
        fontSize: 13,
        color: '#2A2620',
        lineHeight: 18,
        marginTop: currentTheme.spacing.sm,
    },
    askMetaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: currentTheme.spacing.sm,
    },
    askMetaChip: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: currentTheme.spacing.sm,
        paddingVertical: 4,
        borderRadius: 999,
        marginRight: currentTheme.spacing.sm,
        marginBottom: currentTheme.spacing.sm,
    },
    askMetaText: {
        fontSize: 11,
        color: '#4B473F',
        fontWeight: '600',
    },
    insightRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    insightRowSpacing: {
        marginBottom: currentTheme.spacing.md,
    },
    insightIcon: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: currentTheme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: currentTheme.spacing.sm,
    },
    insightText: {
        flex: 1,
    },
    insightTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: currentTheme.colors.text,
    },
    insightDetail: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.xs,
    },
});

export const getPayrollScreenStyles = (currentTheme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentTheme.colors.background,
    },
    content: {
        padding: currentTheme.spacing.lg,
        paddingBottom: currentTheme.spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: currentTheme.colors.text,
    },
    runButton: {
        backgroundColor: currentTheme.colors.primary,
        paddingHorizontal: currentTheme.spacing.md,
        paddingVertical: currentTheme.spacing.sm,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
    },
    runButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: currentTheme.spacing.xs,
    },
    section: {
        marginBottom: currentTheme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: currentTheme.colors.text,
        marginBottom: currentTheme.spacing.md,
    },
    runCard: {
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 16,
        padding: currentTheme.spacing.md,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: currentTheme.spacing.sm,
    },
    runDate: {
        fontSize: 15,
        fontWeight: '700',
        color: currentTheme.colors.text,
        marginBottom: currentTheme.spacing.xs,
    },
    runMeta: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
    },
    runStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    runStatusText: {
        fontSize: 12,
        fontWeight: '600',
        color: currentTheme.colors.textSecondary,
        marginLeft: currentTheme.spacing.xs,
    },
    taskCard: {
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 16,
        padding: currentTheme.spacing.md,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskRowSpacing: {
        marginBottom: currentTheme.spacing.md,
    },
    taskText: {
        flex: 1,
        marginLeft: currentTheme.spacing.sm,
    },
    taskTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: currentTheme.colors.text,
    },
    taskDetail: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.xs,
    },
    snapshotCard: {
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 18,
        padding: currentTheme.spacing.lg,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    snapshotItem: {
        alignItems: 'center',
        flex: 1,
    },
    snapshotDivider: {
        width: 1,
        height: 40,
        backgroundColor: currentTheme.colors.border,
    },
    snapshotLabel: {
        fontSize: 11,
        color: currentTheme.colors.textSecondary,
        marginBottom: currentTheme.spacing.xs,
    },
    snapshotValue: {
        fontSize: 16,
        fontWeight: '700',
        color: currentTheme.colors.text,
    },
});

export const getOnboardingScreenStyles = (currentTheme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentTheme.colors.background,
    },
    content: {
        padding: currentTheme.spacing.lg,
        paddingBottom: currentTheme.spacing.xl,
    },
    header: {
        marginBottom: currentTheme.spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: currentTheme.colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.xs,
    },
    scanCard: {
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 18,
        padding: currentTheme.spacing.lg,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.xl,
    },
    scanIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: currentTheme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: currentTheme.spacing.md,
    },
    scanText: {
        flex: 1,
    },
    scanTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: currentTheme.colors.text,
        marginBottom: currentTheme.spacing.xs,
    },
    scanSubtitle: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
    },
    scanButton: {
        backgroundColor: currentTheme.colors.primary,
        paddingHorizontal: currentTheme.spacing.md,
        paddingVertical: currentTheme.spacing.sm,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: currentTheme.spacing.xs,
    },
    section: {
        marginBottom: currentTheme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: currentTheme.spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: currentTheme.colors.text,
    },
    sectionLink: {
        fontSize: 13,
        color: currentTheme.colors.primary,
        fontWeight: '600',
    },
    importGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    importCard: {
        width: '48%',
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 16,
        padding: currentTheme.spacing.md,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
        alignItems: 'flex-start',
        marginBottom: currentTheme.spacing.md,
    },
    importTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: currentTheme.colors.text,
        marginTop: currentTheme.spacing.sm,
    },
    importSubtitle: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.xs,
    },
    pendingCard: {
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 18,
        padding: currentTheme.spacing.lg,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    pendingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pendingRowSpacing: {
        marginBottom: currentTheme.spacing.md,
    },
    pendingIcon: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: currentTheme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: currentTheme.spacing.sm,
    },
    pendingText: {
        flex: 1,
    },
    pendingName: {
        fontSize: 14,
        fontWeight: '700',
        color: currentTheme.colors.text,
    },
    pendingDoc: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        marginTop: currentTheme.spacing.xs,
    },
    pendingStatus: {
        paddingHorizontal: currentTheme.spacing.sm,
        paddingVertical: 4,
        borderRadius: 999,
    },
    statusReady: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
    },
    statusReview: {
        backgroundColor: 'rgba(245, 158, 11, 0.18)',
    },
    statusMissing: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    pendingStatusText: {
        fontSize: 11,
        fontWeight: '600',
        color: currentTheme.colors.textSecondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: currentTheme.spacing.lg,
    },
    modalCard: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 18,
        padding: currentTheme.spacing.lg,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: currentTheme.colors.text,
        marginBottom: currentTheme.spacing.xs,
    },
    modalSubtitle: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        marginBottom: currentTheme.spacing.md,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
        borderRadius: 12,
        paddingHorizontal: currentTheme.spacing.md,
        paddingVertical: currentTheme.spacing.sm,
        color: currentTheme.colors.text,
        backgroundColor: currentTheme.colors.background,
        marginBottom: currentTheme.spacing.sm,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: currentTheme.spacing.sm,
    },
    modalButton: {
        flex: 1,
        backgroundColor: currentTheme.colors.primary,
        paddingVertical: currentTheme.spacing.sm,
        borderRadius: 999,
        alignItems: 'center',
        marginLeft: currentTheme.spacing.sm,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    modalCancel: {
        flex: 1,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
        paddingVertical: currentTheme.spacing.sm,
        borderRadius: 999,
        alignItems: 'center',
        marginRight: currentTheme.spacing.sm,
    },
    modalCancelText: {
        color: currentTheme.colors.textSecondary,
        fontWeight: '600',
        fontSize: 13,
    },
});

export const getAuthScreenStyles = (currentTheme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentTheme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: currentTheme.spacing.lg,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: currentTheme.colors.surface,
        borderRadius: 20,
        padding: currentTheme.spacing.lg,
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: currentTheme.colors.text,
        marginBottom: currentTheme.spacing.xs,
    },
    subtitle: {
        fontSize: 14,
        color: currentTheme.colors.textSecondary,
        marginBottom: currentTheme.spacing.lg,
    },
    inputGroup: {
        marginBottom: currentTheme.spacing.md,
    },
    label: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        marginBottom: currentTheme.spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: currentTheme.colors.border,
        backgroundColor: currentTheme.colors.background,
        borderRadius: 12,
        paddingHorizontal: currentTheme.spacing.md,
        paddingVertical: currentTheme.spacing.sm,
        color: currentTheme.colors.text,
    },
    primaryButton: {
        backgroundColor: currentTheme.colors.primary,
        paddingVertical: currentTheme.spacing.md,
        borderRadius: 999,
        alignItems: 'center',
        marginTop: currentTheme.spacing.sm,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    secondaryButton: {
        marginTop: currentTheme.spacing.md,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 12,
        color: currentTheme.colors.textSecondary,
        fontWeight: '600',
    },
});
