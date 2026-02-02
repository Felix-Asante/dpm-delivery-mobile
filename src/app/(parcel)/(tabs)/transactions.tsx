import { AppConfig } from "@/constants/config";
import { getUserWalletQueryOptions } from "@/lib/tanstack-query/query-options/users";
import { api } from "@/services/api";
import { WalletTransactionTypes } from "@/types/enums/index.enum";
import type { Transaction } from "@/types/wallet.types";
import { formatCurrency } from "@/utils/currency";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { Skeleton } from "heroui-native";
import React from "react";
import { Pressable, RefreshControl, Text, View } from "react-native";

const FILTER_OPTIONS = [
  {
    value: "all",
    label: "All",
    icon: "apps" as const,
  },
  {
    value: WalletTransactionTypes.PAYMENT_RECEIVED,
    label: "Received",
    icon: "arrow-down" as const,
  },
  {
    value: WalletTransactionTypes.WITHDRAWAL,
    label: "Withdrawn",
    icon: "arrow-up" as const,
  },
  {
    value: WalletTransactionTypes.DEBIT,
    label: "Debit",
    icon: "remove" as const,
  },
  {
    value: WalletTransactionTypes.ADJUSTMENT,
    label: "Adjustment",
    icon: "swap-horizontal" as const,
  },
  {
    value: WalletTransactionTypes.PAYOUT_PENDING,
    label: "Pending",
    icon: "time" as const,
  },
  {
    value: WalletTransactionTypes.PAYOUT_APPROVED,
    label: "Approved",
    icon: "checkmark" as const,
  },
];

export default function Transactions() {
  const [selectedFilter, setSelectedFilter] = React.useState<string>("all");
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: walletResponse, isLoading: isWalletLoading } = useQuery(
    getUserWalletQueryOptions(),
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["transactions", "infinite", selectedFilter],
    queryFn: ({ pageParam = 1 }) => {
      const params: { limit: number; page: number; type?: string } = {
        limit: 20,
        page: pageParam,
      };
      if (selectedFilter !== "all") {
        params.type = selectedFilter;
      }
      return api.users.transactions(params);
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.meta.currentPage;
      const totalPages = lastPage.data.meta.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const transactions: Transaction[] = React.useMemo(
    () => data?.pages.flatMap((page) => page.data.items) || [],
    [data],
  );

  const wallet = walletResponse?.data;
  const totalEarned = wallet?.totalEarned ? parseFloat(wallet.totalEarned) : 0;
  const balance = wallet?.balance ? parseFloat(wallet.balance) : 0;
  const totalWithdrawn = totalEarned - balance;

  // Get all transactions (not filtered) for total counts
  const allTransactions: Transaction[] = React.useMemo(
    () => data?.pages.flatMap((page) => page.data.items) || [],
    [data],
  );

  const totalTransactions =
    data?.pages[0]?.data.meta?.totalItems || transactions.length;

  const totalReceived = allTransactions
    .filter((t) => t.type === WalletTransactionTypes.PAYMENT_RECEIVED)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-safe pb-4">
        <Text className="text-xl font-bold text-secondary">Transactions</Text>
      </View>

      {/* Summary Stats */}
      <View className="bg-white px-5 pb-4">
        <View className="flex-row gap-3">
          <View className="flex-1 bg-green-50 border border-green-200 rounded-xl p-3">
            <Text className="text-xs text-green-700 font-medium mb-1">
              Total Transactions
            </Text>
            {isLoading && transactions.length === 0 ? (
              <Skeleton className="w-12 h-6 rounded" />
            ) : (
              <Text className="text-2xl font-bold text-green-900">
                {totalTransactions}
              </Text>
            )}
          </View>

          <View className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3">
            <Text className="text-xs text-blue-700 font-medium mb-1">
              Total Received
            </Text>
            {isWalletLoading ? (
              <Skeleton className="w-16 h-6 rounded" />
            ) : (
              <Text
                className="text-xl font-bold text-blue-900"
                numberOfLines={1}
              >
                {AppConfig.currency.symbol}
                {formatCurrency(totalReceived)}
              </Text>
            )}
          </View>
        </View>

        <View className="mt-3">
          <View className="bg-red-50 border border-red-200 rounded-xl p-3">
            <Text className="text-xs text-red-700 font-medium mb-1">
              Total Withdrawn
            </Text>
            {isWalletLoading ? (
              <Skeleton className="w-16 h-6 rounded" />
            ) : (
              <Text className="text-xl font-bold text-red-900">
                {AppConfig.currency.symbol}
                {formatCurrency(totalWithdrawn)}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Filters */}
      <View className="bg-white px-5 py-3 mb-2">
        <View className="flex-row flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter) => {
            const isSelected = selectedFilter === filter.value;
            return (
              <Pressable key={filter.value}>
                <View
                  className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full ${
                    isSelected
                      ? "bg-accent"
                      : "bg-gray-100 border border-gray-200"
                  }`}
                  onTouchEnd={() => setSelectedFilter(filter.value)}
                >
                  <Ionicons
                    name={filter.icon}
                    size={14}
                    color={isSelected ? "#fff" : "#6b7280"}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      isSelected ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {filter.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Transaction List */}
      <View className="flex-1">
        {isLoading ? (
          <Loader />
        ) : transactions.length === 0 ? (
          <EmptyState selectedFilter={selectedFilter} />
        ) : (
          <FlashList
            data={transactions}
            renderItem={({ item }) => <TransactionCard transaction={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 24,
            }}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ItemSeparatorComponent={() => <View className="h-2" />}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View className="py-4">
                  <Skeleton
                    className="h-20 w-full rounded-xl opacity-25"
                    animation={{
                      shimmer: {
                        highlightColor: "rgba(242, 242, 242, 0.2)",
                      },
                    }}
                  />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const getTransactionInfo = (type: WalletTransactionTypes) => {
    switch (type) {
      case WalletTransactionTypes.PAYMENT_RECEIVED:
        return {
          label: "Payment Received",
          icon: "arrow-down" as const,
          color: "#10b981",
        };
      case WalletTransactionTypes.WITHDRAWAL:
        return {
          label: "Withdrawal",
          icon: "arrow-up" as const,
          color: "#ef4444",
        };
      case WalletTransactionTypes.DEBIT:
        return {
          label: "Debit",
          icon: "remove" as const,
          color: "#f59e0b",
        };
      case WalletTransactionTypes.ADJUSTMENT:
        return {
          label: "Adjustment",
          icon: "swap-horizontal" as const,
          color: "#8b5cf6",
        };
      case WalletTransactionTypes.PAYOUT_PENDING:
        return {
          label: "Payout Pending",
          icon: "time" as const,
          color: "#f59e0b",
        };
      case WalletTransactionTypes.PAYOUT_APPROVED:
        return {
          label: "Payout Approved",
          icon: "checkmark-circle" as const,
          color: "#10b981",
        };
      case WalletTransactionTypes.PAYOUT_REJECTED:
        return {
          label: "Payout Rejected",
          icon: "close-circle" as const,
          color: "#ef4444",
        };
      case WalletTransactionTypes.PAYOUT_FAILED:
        return {
          label: "Payout Failed",
          icon: "alert-circle" as const,
          color: "#ef4444",
        };
      default:
        return {
          label: type,
          icon: "ellipse" as const,
          color: "#6b7280",
        };
    }
  };

  const isPositive =
    transaction.type === WalletTransactionTypes.PAYMENT_RECEIVED ||
    transaction.type === WalletTransactionTypes.ADJUSTMENT ||
    transaction.type === WalletTransactionTypes.PAYOUT_APPROVED;

  const amount = parseFloat(transaction.amount);
  const info = getTransactionInfo(transaction.type);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <View className="bg-white rounded-xl p-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="bg-gray-100 rounded-full p-2">
            <Ionicons name={info.icon} size={20} color={info.color} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-secondary">
              {info.label}
            </Text>
            <Text className="text-xs text-gray-400 mt-0.5">
              {formatDate(transaction.createdAt)} •{" "}
              {formatTime(transaction.createdAt)}
            </Text>
          </View>
        </View>
        <Text
          className={`text-lg font-bold ${
            isPositive ? "text-green-600" : "text-gray-900"
          }`}
        >
          {isPositive ? "+" : ""}
          {AppConfig.currency.symbol}
          {formatCurrency(amount)}
        </Text>
      </View>
    </View>
  );
}

function EmptyState({ selectedFilter }: { selectedFilter: string }) {
  const filterLabel =
    FILTER_OPTIONS.find((f) => f.value === selectedFilter)?.label || "All";

  return (
    <View className="flex-1 items-center justify-center px-8 bg-white mx-5 rounded-2xl my-2">
      <View className="bg-gray-100 rounded-full p-8 mb-4">
        <Ionicons name="receipt-outline" size={56} color="#d1d5db" />
      </View>

      <Text className="text-lg font-bold text-secondary text-center mb-2">
        No Transactions
      </Text>

      <Text className="text-sm text-gray-500 text-center leading-5">
        {selectedFilter === "all"
          ? "Your transactions will appear here once you start receiving payments."
          : `No ${filterLabel.toLowerCase()} transactions found.`}
      </Text>
    </View>
  );
}

function Loader() {
  return (
    <View className="px-5 pt-2">
      <View className="gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i + 1}
            className="h-20 w-full rounded-xl"
            animation={{
              shimmer: {
                highlightColor: "rgba(242, 242, 242, 0.2)",
              },
            }}
          />
        ))}
      </View>
    </View>
  );
}
