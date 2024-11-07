import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LoadingOverlay from "../common/LoadingOverlay";
import { useSelector, useDispatch } from "react-redux";
import { fetchCompanies } from "../../features/company/companySlice";
import { generateJobDescriptionAsync } from "../../features/jobs/jobSlice";

const JOB_TYPES = ["full-time", "part-time", "contract", "internship"];
const JOB_LEVELS = ["entry", "mid-level", "senior"];
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Other",
];

const COMMON_SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Git",
];

const JobModal = ({ job, onSubmit, onClose, isSubmitting }) => {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [],
    responsibilities: [],
    salaryRange: {
      min: "",
      max: "",
    },
    locationType: "remote",
    location: "",
    type: "full-time",
    level: "mid-level",
    companyId: "",
    industry: "Technology",
  });

  useEffect(() => {
    dispatch(fetchCompanies(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        requirements: job.requirements || [],
        responsibilities: job.responsibilities || [],
        salaryRange: job.salaryRange || { min: "", max: "" },
        locationType: job.location === "Remote" ? "remote" : "onsite",
        location: job.location === "Remote" ? "" : job.location,
        type: job.type || "full-time",
        level: job.level || "mid-level",
        companyId: job.company?._id || "",
        industry: job.industry || "Technology",
      });
      setSelectedSkills(job.skills || []);
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("salary")) {
      setFormData((prev) => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [name.replace("salary", "").toLowerCase()]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      setSelectedSkills([...selectedSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleGenerateDescription = async () => {
    if (
      !formData.title ||
      !formData.level ||
      !formData.type ||
      selectedSkills.length === 0
    ) {
      alert(
        "Please fill in the title, level, type, and at least one skill before generating description"
      );
      return;
    }

    const aiRequestData = {
      title: formData.title,
      industry: formData.industry,
      experienceLevel:
        formData.level === "mid-level"
          ? "Mid-Level"
          : formData.level === "entry"
          ? "Entry"
          : "Senior",
      skills: selectedSkills,
      location:
        formData.locationType === "remote" ? "Remote" : formData.location,
      employmentType: formData.type,
    };

    setIsGenerating(true);
    const result = await dispatch(
      generateJobDescriptionAsync({
        jobData: aiRequestData,
        token,
      })
    );
    setIsGenerating(false);

    if (result.meta.requestStatus === "fulfilled") {
      const { description, responsibilities, requirements } = result.payload;
      setFormData((prev) => ({
        ...prev,
        description,
        responsibilities,
        requirements,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      location:
        formData.locationType === "remote" ? "Remote" : formData.location,
      skills: selectedSkills,
    };
    onSubmit(submitData);
  };

  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()],
      }));
      setNewResponsibility("");
    }
  };

  const removeRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const removeResponsibility = (index) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {(isSubmitting || isGenerating) && (
          <LoadingOverlay
            message={
              isGenerating ? "Generating job description..." : "Saving job..."
            }
          />
        )}
        <div className="bg-white rounded-lg max-w-4xl w-full p-6">
          <h2 className="text-2xl font-bold mb-4">
            {job ? "Update Job" : "Create Job"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company *
                </label>
                <select
                  name="companyId"
                  required
                  value={formData.companyId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Type and Level */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Level *
                </label>
                <select
                  name="level"
                  required
                  value={formData.level}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  {JOB_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location Type *
                </label>
                <select
                  name="locationType"
                  required
                  value={formData.locationType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>
            </div>

            {/* Location for onsite */}
            {formData.locationType === "onsite" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter location"
                />
              </div>
            )}

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Salary *
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  required
                  value={formData.salaryRange.min}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maximum Salary *
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  required
                  value={formData.salaryRange.max}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            {/* Industry Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industry *
              </label>
              <select
                name="industry"
                required
                value={formData.industry}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Add custom skill"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillSelect(skill)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedSkills.includes(skill)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Description with AI Generation */}
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Generate with AI
                </button>
              </div>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Requirements
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Add a requirement"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <ul className="mt-2 space-y-2">
                {formData.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Add a responsibility"
                />
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <ul className="mt-2 space-y-2">
                {formData.responsibilities.map((resp, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    {resp}
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {job ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

JobModal.propTypes = {
  job: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default JobModal;
