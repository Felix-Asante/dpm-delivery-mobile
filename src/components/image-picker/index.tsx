import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ExpoImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export type ImagePickerProps = {
  label?: string;
  description?: string;
  allowsMultiple?: boolean;
  maxImages?: number;
  mediaTypes?: ExpoImagePicker.MediaTypeOptions;
  allowedImageTypes?: ("jpg" | "jpeg" | "png" | "gif" | "webp")[];
  quality?: number;
  onImagesChange?: (images: ImageAsset[]) => void;
  initialImages?: ImageAsset[];
  errorMessage?: string;
  disabled?: boolean;
};

export type ImageAsset = {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
  fileName?: string;
  fileSize?: number;
};

export default function ImagePicker({
  label = "Photos",
  description,
  allowsMultiple = false,
  maxImages = 10,
  mediaTypes = ExpoImagePicker.MediaTypeOptions.Images,
  allowedImageTypes = ["jpg", "jpeg", "png"],
  quality = 0.8,
  onImagesChange,
  initialImages = [],
  errorMessage,
  disabled = false,
}: ImagePickerProps) {
  const [images, setImages] = useState<ImageAsset[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to upload images.",
        [{ text: "OK" }],
      );
      return false;
    }
    return true;
  };

  const isImageTypeAllowed = (uri: string): boolean => {
    const extension = uri.split(".").pop()?.toLowerCase();
    if (!extension) return false;
    return allowedImageTypes.some(
      (type) =>
        type.toLowerCase() === extension ||
        (type === "jpg" && extension === "jpeg"),
    );
  };

  const handlePickImages = async () => {
    if (disabled) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setIsLoading(true);
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsMultipleSelection: allowsMultiple,
        quality,
        selectionLimit: allowsMultiple ? maxImages - images.length : 1,
      });

      if (!result.canceled) {
        // Filter images by allowed types
        const validAssets = result.assets.filter((asset) => {
          const isValid = isImageTypeAllowed(asset.uri);
          if (!isValid) {
            Alert.alert(
              "Invalid Image Type",
              `Only ${allowedImageTypes.join(", ").toUpperCase()} images are allowed.`,
            );
          }
          return isValid;
        });

        const newImages: ImageAsset[] = validAssets.map((asset) => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.mimeType,
          fileName: asset.fileName ?? undefined,
          fileSize: asset.fileSize,
        }));

        const updatedImages = allowsMultiple
          ? [...images, ...newImages].slice(0, maxImages)
          : newImages;

        setImages(updatedImages);
        onImagesChange?.(updatedImages);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images. Please try again.");
      console.error("Image picker error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const canAddMore = !allowsMultiple || images.length < maxImages;

  return (
    <View className="gap-2">
      {label && (
        <View className="gap-1">
          <Text className="text-sm font-medium text-secondary">{label}</Text>
          {description && (
            <Text className="text-xs text-gray-500">{description}</Text>
          )}
        </View>
      )}

      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="gap-2"
        >
          <View className="flex-row gap-2">
            {images.map((image, index) => (
              <View
                key={`${image.uri}-${index}`}
                className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100"
              >
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  transition={200}
                />
                {!disabled && (
                  <Pressable
                    onPress={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1 active:bg-black/80"
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </Pressable>
                )}
              </View>
            ))}

            {allowsMultiple && canAddMore && !disabled && (
              <Pressable
                onPress={handlePickImages}
                disabled={isLoading}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 items-center justify-center active:bg-gray-100"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#f97316" />
                ) : (
                  <>
                    <Ionicons name="add" size={28} color="#9ca3af" />
                    <Text className="text-xs text-gray-500 mt-1">Add More</Text>
                  </>
                )}
              </Pressable>
            )}
          </View>
        </ScrollView>
      )}

      {images.length === 0 && (
        <Pressable
          onPress={handlePickImages}
          disabled={isLoading || disabled}
          className={`${
            disabled ? "bg-gray-100" : "bg-gray-50 active:bg-gray-100"
          } border-2 border-dashed border-gray-300 rounded-xl p-4 items-center justify-center min-h-[120px]`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#f97316" />
          ) : (
            <>
              <View className="bg-accent/10 rounded-full p-3 mb-2">
                <Ionicons name="image-outline" size={28} color="#f97316" />
              </View>
              <Text className="text-base font-semibold text-secondary mb-1">
                {allowsMultiple ? "Select Photos" : "Select Photo"}
              </Text>
              <Text className="text-xs text-gray-500 text-center">
                {allowsMultiple
                  ? `Choose up to ${maxImages} photos`
                  : "Choose a photo from your library"}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                Supported:{" "}
                {allowedImageTypes.map((t) => t.toUpperCase()).join(", ")}
              </Text>
            </>
          )}
        </Pressable>
      )}

      {allowsMultiple && images.length > 0 && (
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-500">
            {images.length} of {maxImages} photo{images.length !== 1 ? "s" : ""}{" "}
            selected
          </Text>
          {!disabled && (
            <Pressable
              onPress={() => {
                setImages([]);
                onImagesChange?.([]);
              }}
              className="active:opacity-70"
            >
              <Text className="text-xs text-accent font-medium">Clear All</Text>
            </Pressable>
          )}
        </View>
      )}

      {errorMessage && (
        <Text className="text-xs text-red-500 mt-1">{errorMessage}</Text>
      )}
    </View>
  );
}
