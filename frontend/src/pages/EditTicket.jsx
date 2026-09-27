import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
    deadline: "",
    imageUrl: "",
    roomNo: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const CLOUDINARY_CLOUD_NAME = "drcetd9mw";
  const CLOUDINARY_UPLOAD_PRESET = "helpdesk_upload";

  // =========================
  // FETCH TICKET
  // =========================
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch ticket");
        }

        const ticket = await response.json();

        const formattedDeadline = ticket.deadline
          ? ticket.deadline.slice(0, 16)
          : "";

        setFormData({
          title: ticket.title || "",
          description: ticket.description || "",
          priority: ticket.priority || "",
          category: ticket.category || "",
          deadline: formattedDeadline,
          imageUrl: ticket.imageUrl || "",
          roomNo: ticket.roomNo || "",
        });

        // Show existing Cloudinary image
        if (ticket.imageUrl) {
          setImagePreview(ticket.imageUrl);
        }
      } catch (error) {
        console.error("Error loading ticket:", error);
        alert("Failed to load ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE IMAGE
  // =========================
  const handleImageSelect = (file) => {
    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    setSelectedImage(file);

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      handleImageSelect(file);
    }
  };

  // =========================
  // DRAG & DROP
  // =========================
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      handleImageSelect(file);
    }
  };

  // =========================
  // UPLOAD IMAGE TO CLOUDINARY
  // =========================
  const uploadImageToCloudinary = async () => {
    if (!selectedImage) {
      return formData.imageUrl;
    }

    setUploadingImage(true);

    try {
      const cloudinaryFormData = new FormData();

      cloudinaryFormData.append("file", selectedImage);
      cloudinaryFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        },
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();

      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // =========================
  // REMOVE IMAGE
  // =========================
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");

    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      // Upload new image if selected
      let imageUrl = formData.imageUrl;

      if (selectedImage) {
        imageUrl = await uploadImageToCloudinary();
      }

      const response = await fetch(`http://localhost:8080/api/tickets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          category: formData.category,
          deadline: formData.deadline,

          // Room number
          roomNo: formData.roomNo,

          imageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Backend error:", errorText);

        throw new Error("Failed to update ticket");
      }

      alert("Ticket updated successfully.");

      navigate(`/tickets/${id}`);
    } catch (error) {
      console.error("Error updating ticket:", error);

      alert(error.message || "Failed to update ticket.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading ticket...</p>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(`/tickets/${id}`)}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          ← Back to Ticket
        </button>

        <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Ticket</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          {/* ================= TITLE ================= */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* ================= DESCRIPTION ================= */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* ================= CATEGORY + ROOM ================= */}
          <div className="grid grid-cols-2 gap-4">
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
                maxLength={50}
                placeholder="Example: Technical Issue"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
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
                maxLength={20}
                placeholder="Example: 204"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* ================= PRIORITY ================= */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Select priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* ================= DEADLINE ================= */}
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* ================= IMAGE DROPBOX ================= */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Attachment Image
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-xl border-2 border-dashed p-6 text-center transition ${
                dragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-blue-400"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="ticket-image"
              />

              {!imagePreview ? (
                <>
                  <div className="mb-3 text-4xl">🖼️</div>

                  <p className="text-sm font-medium text-gray-700">
                    Drag & drop your image here
                  </p>

                  <p className="my-1 text-xs text-gray-400">or</p>

                  <label
                    htmlFor="ticket-image"
                    className="inline-block cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Browse Image
                  </label>

                  <p className="mt-3 text-xs text-gray-400">
                    PNG, JPG, JPEG, WEBP • Maximum 5 MB
                  </p>
                </>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Ticket attachment preview"
                    className="mx-auto max-h-72 rounded-lg object-contain"
                  />

                  <div className="mt-4 flex justify-center gap-3">
                    <label
                      htmlFor="ticket-image"
                      className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Change Image
                    </label>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>

                  {selectedImage && (
                    <p className="mt-3 text-xs text-gray-500">
                      Selected: {selectedImage.name}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadingImage
                ? "Uploading Image..."
                : saving
                  ? "Saving..."
                  : "Update Ticket"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/tickets/${id}`)}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTicket;
