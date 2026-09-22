import { useState } from "react";
import axios from "axios";
import { createTicket } from "../services/ticketService";

function CreateTicketForm({ onTicketCreated, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "LOW",
    category: "",
    deadline: "",
    roomNo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please drop an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      let imageUrl = null;

      // --------------------------------
      // 1. Upload image to Cloudinary
      // --------------------------------
      if (image) {
        setUploading(true);

        const uploadData = new FormData();
        uploadData.append("file", image);

        const uploadResponse = await axios.post(
          "http://localhost:8080/api/uploads/image",
          uploadData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        imageUrl = uploadResponse.data;
        setUploading(false);
      }

      // --------------------------------
      // 2. Create ticket
      // --------------------------------
      const ticketData = {
        ...formData,
        imageUrl: imageUrl,
      };

      const response = await createTicket(ticketData);

      onTicketCreated(response.data);
      onClose();
    } catch (error) {
      console.error(error);

      setUploading(false);

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to create ticket.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Create Ticket</h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter ticket title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Describe your problem..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Attach Image
            </label>

            <label
              htmlFor="image-upload"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50"
            >
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Selected preview"
                    className="mx-auto max-h-48 max-w-full rounded-lg object-contain"
                  />

                  <p className="mt-2 text-sm text-gray-500">{image?.name}</p>

                  <p className="text-xs text-gray-400">
                    Click to replace image
                  </p>
                </div>
              ) : (
                <>
                  <svg
                    className="mb-3 h-10 w-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 0117.9 6L18 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v9"
                    />
                  </svg>

                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG, JPEG or WEBP
                  </p>

                  <p className="text-xs text-gray-400">Maximum size: 5MB</p>
                </>
              )}

              <input
                id="image-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {image && (
              <button
                type="button"
                onClick={removeImage}
                className="mt-2 text-sm text-red-500 hover:text-red-700"
              >
                Remove image
              </button>
            )}
          </div>

          {/* Deadline + Category */}
          <div className="grid grid-cols-2 gap-4">
            {/* Deadline */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Deadline
              </label>

              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. Software, Hardware"
              />
            </div>

            {/* Room No */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Room No.
              </label>

              <input
                type="text"
                name="roomNo"
                value={formData.roomNo}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. 204"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading
                ? "Uploading image..."
                : loading
                  ? "Creating..."
                  : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicketForm;
