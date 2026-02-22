// İngilizce (en) çeviriler
export const enTranslations = {
  // General
  app_name: "Receipt Tracker",
  cancel: "Cancel",
  save: "Save",
  delete: "Delete",
  edit: "Edit",
  ok: "OK",
  yes: "Yes",
  no: "No",
  general_error: "An error occurred",
  back: "Back",
  next: "Next",
  home: "Home",

  // Store details and accessibility
  tap_to_view_store_details: "Tap to view store details",
  no_users_assigned: "No users assigned to this store",
  store_details: "Store Details",
  store_users: "Store Users",

  // Receipt Step Indicator
  receipt_type: "Receipt Type",
  photo: "Photo",
  details: "Details",
  preview: "Preview",

  // Activity Logs
  activity_logs: "Activity Logs",
  no_logs: "No logs found",
  loading_more: "Loading more...",
  total_logs_count: "Total {{count}} logs found",
  unknown: "Unknown",
  no_logs_found: "No activity logs found",
  logs: "Logs",
  search_logs: "Search Logs",
  log_details: "Log Details",
  log_date: "Date",
  log_daily: "Daily Logs",
  log_summary: "Summary",
  filter_logs: "Filter Logs",
  date_range: "Date Range",
  all: "All",
  activity_distribution: "Activity Distribution",
  charts_coming_soon: "Charts coming soon",
  total_logs: "Total Logs",
  success_count: "Success",
  error_count: "Error",
  user_count: "User Count",
  store_count: "Store Count",
  today: "Today",
  last_7_days: "Last 7 Days",
  last_30_days: "Last 30 Days",
  loading: "Loading",

  // Activity Types - Flat structure
  activity_type_RECEIPT_CREATED: "Receipt Created",
  activity_type_RECEIPT_UPDATED: "Receipt Updated",
  activity_type_RECEIPT_DELETED: "Receipt Deleted",
  activity_type_RECEIPT_SEARCHED: "Receipt Searched",
  activity_type_USER_LOGIN: "User Login",
  activity_type_USER_LOGOUT: "User Logout",
  activity_type_USER_REGISTERED: "User Registered",
  activity_type_USER_PASSWORD_RESET: "Password Reset",
  activity_type_USER_UPDATED: "User Updated",
  activity_type_STORE_CREATED: "Store Created",
  activity_type_STORE_UPDATED: "Store Updated",
  activity_type_STORE_DELETED: "Store Deleted",
  activity_type_SYSTEM_ERROR: "System Error",
  activity_type_API_CALL: "API Call",
  activity_type_DATABASE_OPERATION: "Database Operation",
  activity_type_USER_CREATED: "User Created",
  activity_type_USER_DELETED: "User Deleted",
  activity_type_PASSWORD_CHANGED: "Password Changed",
  activity_type_PERMISSION_CHANGED: "Permission Changed",
  activity_type_RECEIPT_EXPORTED: "Receipt Exported",
  activity_type_RECEIPT_IMPORTED: "Receipt Imported",

  // PosReceiptForm
  pos_receipt_details: "POS Receipt Details",
  hide_details: "Hide Details",
  show_details: "Show Details",
  bank_not_selected: "Bank not selected",
  bank_information: "Bank Information",
  invoice_number: "Invoice Number",
  invoice_date: "Invoice Date",
  invoice_amount: "Invoice Amount",
  enter_invoice_number: "Enter invoice number",
  fill_all_required_fields: "Please fill all required fields",
  bank_selection_required: "Bank selection is required",
  invoice_number_required: "Invoice number is required",
  invoice_date_required: "Invoice date is required",
  enter_valid_amount: "Enter a valid amount",

  // CashReceiptForm
  total_amount: "Total Amount",
  cash_details: "Cash Details",
  coins: "Coins",
  total_must_be_greater_than_zero: "Total amount must be greater than zero",

  // ExpenseReceiptForm
  total: "Total",
  description: "Description",
  expense_amount: "Expense Amount",
  new_expense: "New Expense",
  at_least_one_expense_item_required: "At least one expense item is required",
  description_required: "Description is required",
  valid_amount_required: "Please enter a valid amount",

  // Missing translations
  receipt_number: "Receipt Number",
  date: "Date",
  user_information: "User Information",
  photos: "Photos",
  location: "Location",
  address: "Address",
  phone_format: "Phone Format",
  enter: "enter",
  update: "Update",

  // About Page
  about_app: "About App",
  about_app_description:
    "Receipt Tracker is a modern application that allows you to easily track your receipts and helps you organize your expenses. It provides a user-friendly interface for saving, editing, and searching your receipts.",
  features: "Features",
  photo_support: "Photo Support",
  take_save_receipt_photos: "Take and save receipt photos",
  different_receipt_types: "Different Receipt Types",
  manage_cash_pos_receipts: "Manage cash, POS and expense receipts",
  advanced_search: "Filter",
  filter_by_date_store_type: "Filter by date, store and receipt type",
  user_management: "User Management",
  different_roles_permissions: "Different roles and permission levels",
  contact: "Contact",
  all_rights_reserved: "All rights reserved",

  // Privacy Page
  privacy_policy: "Privacy Policy",
  privacy_intro:
    "This privacy policy has been prepared to inform you about the information collected, used and protected while using the Receipt Tracker application.",
  collected_information: "Collected Information",
  collected_information_desc:
    "Our application collects your personal information (name, email, phone number) required to create and manage your account and information about receipt data.",
  data_usage: "Data Usage",
  data_usage_desc:
    "The information we collect is used to provide, improve and personalize our services. Your data is not sold or shared with third parties.",
  data_security: "Data Security",
  data_security_desc:
    "The security of your information is important to us. We use industry standard security measures to protect your information. All data is encrypted and stored on secure servers.",
  cookies: "Cookies and Similar Technologies",
  cookies_desc:
    "Our application may use cookies and similar technologies to improve your experience. These technologies are used to remember your preferences and make the application more efficient.",
  privacy_contact_desc:
    "If you have any questions or concerns about our privacy policy, please contact us at support@receipttracker.com.",
  last_updated: "Last updated",
  june: "June",

  // Form validations
  store_name_required: "Store name is required",
  store_name_min_length: "Store name must be at least 2 characters",
  location_required: "Location is required",
  location_min_length: "Location is too short",
  phone_required: "Phone number is required",
  phone_start_with_5: "Phone number must start with 5",
  phone_length: "Phone number must be 10 digits (5XX-XXX-XX-XX)",
  phone_format_invalid: "Please enter a valid phone number (5XX-XXX-XX-XX)",
  address_required: "Address is required",
  address_min_length: "Address must be detailed",

  // User Roles
  admin: "Parent/Relative",
  manager: "Device Owner",
  viewer_role: "Viewer",
  user: "User",
  store_manager: "Store Manager",

  // User Statuses
  status_active: "Active",
  status_inactive: "Inactive",
  status_pending: "Pending Approval",
  status_approved: "Approved",
  status_rejected: "Rejected",

  // Login/Registration Screens
  login: "Login",
  login_fields_required: "Please fill in email and password fields.",
  login_error: "An error occurred during login.",
  no_account: "Don't have an account?",
  create_account: "Create Account",
  register: "Register",
  email: "Email",
  password: "Password",
  confirm_password: "Confirm Password",
  forgot_password: "Forgot your password?",
  login_screen: "Return to Login Screen",
  login_welcome: "Welcome",
  login_tagline: "Sign in to Receipt Tracker app",

  // Forgot Password Screen
  password_reset: "Password Reset",
  reset_password_subtitle:
    "Enter your email address to receive a password reset link.",
  reset_link_sent: "Password reset link sent to your email address",
  reset_failed: "Password reset failed. Please try again.",
  empty_email: "Email address cannot be empty",
  send_reset_link: "Send",
  sent: "Sent",

  // Registration Process
  select_store_required: "Please select a store",
  fullname_required: "Full name is required",
  username_required: "Username is required",
  username_min_length: "Username must be at least 3 characters",
  email_required: "Email address is required",
  email_invalid: "Please enter a valid email address",
  password_required: "Password is required",
  password_requirements:
    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
  password_requirements_text:
    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
  passwords_not_match: "Passwords do not match",
  personal_information: "Personal Information",
  secure_your_account: "Secure Your Account",
  secure_account: "Secure Account",
  create_secure_password: "Create a secure password for your account",
  personal_info: "Personal Information",
  enter_personal_info: "Enter your personal information",
  previous_step: "Previous",
  back_to_login: "Back to Login",
  registration_success: "Registration successful!",
  registration_failed: "Registration failed. Please try again.",
  registration_complete: "Registration Complete!",
  registration_success_title: "Registration Successful!",
  next_step: "Next Step",
  register_title: "Create Account",
  register_step1: "Store Selection",
  register_step2: "Personal Information",
  register_step3: "Security",
  select_store: "Select your working store",
  enter_account_info: "Enter your account information",
  create_password: "Create your password",
  register_submit: "Register",

  // Registration Success Screen

  // Input Placeholders
  fullname_placeholder: "Full Name",
  username_placeholder: "Username",
  email_placeholder: "Email",
  password_placeholder: "Password",
  password_confirm_placeholder: "Confirm Password",

  // Main Menu
  profile: "Profile",
  settings: "Settings",
  compartments: "Compartments",
  logout: "Logout",
  logging_out: "Logging out...",
  pending_approvals: "Pending Requests",

  // Profile Screen
  change_password: "Change Password",
  full_name: "Full Name",
  username: "Username",
  role: "Role",
  store: "Store",
  account_status: "Account Status",

  // Admin Menu
  users: "Users",
  stores: "Stores",
  receipt_search: "Receipt Search",

  // Receipt Screens
  daily_receipts: "Daily Receipts",
  history: "History",
  add_receipt: "Add Receipt",
  receipt_details: "Receipt Details",
  daily_receipt: "Daily Receipt",

  // Session History Screen
  cannot_process: "Cannot Process",
  complete_receipt_first: "Please complete your current receipt first.",
  delete_receipt: "Delete Receipt",
  confirm_delete_receipt: "Are you sure you want to delete this receipt?",
  success: "Success",
  receipt_deleted: "Receipt deleted successfully.",
  error: "Error",
  receipt_delete_error: "An error occurred while deleting the receipt.",
  receipt_not_found: "Receipt not found",
  receipt_edit_error: "An error occurred while starting to edit the receipt",
  no_receipts_yet: "No receipts yet",
  unknown_user: "Unknown User",

  // Receipt Search Screen
  data_loading_error: "An error occurred while loading data.",
  search_error: "An error occurred during search. Please try again.",
  user_id: "User {{id}}",
  store_id: "Store {{id}}",
  no_results_found: "No receipts found for your search criteria",

  // User Management Screen
  users_management: "User Management",
  no_users_found: "No Users Found",
  no_users_registered: "No users are registered in the system.",
  view_user_details: "View user details",

  // User Detail Screen
  user_info: "User Information",
  username_label: "Username",
  status_label: "Status",
  active_label: "Activation",
  active_status: "Active",
  inactive_status: "Inactive",
  unassigned: "Unassigned",
  set_role: "Set Role",
  admin_role: "Admin",
  manager_role: "Manager",
  restrict_access: "Restrict Access",
  assign_store: "Assign Store",
  other_actions: "Other Actions",
  delete_user: "Delete",
  confirm_admin_role: "Are you sure you want to make this user an admin?",
  confirm_manager_role: "Are you sure you want to make this user a manager?",
  confirm_user_role: "Are you sure you want to restrict this user's access?",
  confirm_delete_user: "Are you sure you want to delete this user?",
  user_action_confirm: "Are you sure you want to perform this action?",
  user_approved_admin: "User approved as admin",
  user_approved_manager: "User approved as manager",
  user_access_restricted: "User access restricted",
  user_deleted: "User deleted",
  operation_failed: "Operation failed",
  action_confirmation: "Action Confirmation",
  attention: "Attention",

  // Store Management Screen
  store_management: "Store Management",
  new_store: "New Store",
  edit_store: "Edit Store",
  store_name: "Store Name",
  store_created: "Store created successfully",
  store_updated: "Store updated successfully",
  store_deleted: "Store deleted successfully",
  store_create_error: "An error occurred during the operation",
  store_delete_error: "An error occurred while deleting the store",
  store_delete_error_has_relations:
    "This store cannot be deleted because it has associated users or receipts.",
  confirm_store_delete: "Are you sure you want to delete the store {{name}}?",
  store_delete_confirmation_title: "Delete Store",
  store_delete_confirmation_message:
    "Are you sure you want to delete the store {{storeName}}?",

  // Settings Screen
  general: "General",
  appearance: "Appearance",
  language: "Language",
  notifications: "Notifications",
  dark_mode: "Dark Mode",
  light_mode: "Light Mode",
  system_theme: "System Theme",
  app_version: "App Version",
  select_language: "Select Language",
  turkish: "Turkish",
  english: "English",
  account: "Account",
  privacy: "Privacy",
  about: "About",

  // Change Password
  current_password: "Current Password",
  new_password: "New Password",
  confirm_new_password: "Confirm New Password",
  password_changed: "Your password has been changed successfully",
  password_error: "Password change failed",
  create_strong_password: "Create a strong password for your security",
  fill_all_fields: "Please fill all fields",

  // Pending Approval Screen
  permission_request: "Permission Request",
  waiting_for_system_authorization:
    "Waiting for system authorization approval.",
  please_try_again_later: "Please try again after {{minutes}} minutes.",
  active_user: "You are an active user",
  submission: "Submission",

  // Create Components
  basic_info: "Basic Information",
  store_selection: "Store Selection",
  default_store: "Default Store",
  receipt_summary: "Receipt for {{store}} on {{date}}",

  step_x_of_y: "Step {{current}}/{{total}}",
  select_receipt_type: "Select Receipt Type",
  select_receipt_type_description:
    "Select the type of receipt you want to create",

  permission_required: "Permission Required",
  gallery_permission_required:
    "Gallery permission is required to select photos.",
  warning: "Warning",
  image_already_added: "This image is already added",
  max_images_limit: "You can add a maximum of {{count}} images",
  image_pick_error: "An error occurred while selecting the image",
  delete_image: "Delete Image",
  confirm_delete_image: "Are you sure you want to delete this image?",

  finish: "Finish",

  // Common Components
  bank_selection: "Bank Selection",
  clear_selection: "Clear Selection",

  start_date: "Start Date",
  end_date: "End Date",

  confirm: "Confirm",

  account_updated: "Your Account Information Has Been Updated",
  status: "Status",
  login_again_message: "Please login again for the changes to take effect.",

  // Search and Filter Components
  search: "Search",
  receipt_type_selection: "Receipt Type Selection",
  clear: "Clear",
  no_receipts_on_this_date: "No receipts found on this date",

  // Receipt Types
  receipt_type_cash: "Cash",
  receipt_type_pos: "Card",
  receipt_type_expense: "Expense",
  cash_receipt: "Cash Receipt",
  pos_receipt: "POS Receipt",
  expense_receipt: "Expense Receipt",
  try_different_filters: "Try different filters",

  // Receipt Type Descriptions
  receipt_type_cash_desc: "For payments made with cash",
  receipt_type_pos_desc: "For payments made with credit card",
  receipt_type_expense_desc: "For various expenses and expenditures",

  // Receipt Type Form Fields
  invoice_information: "Invoice information",
  money_denominations: "Money denominations",

  // Image Upload Component
  receipt_photos: "Receipt Photos",
  receipt_photos_edit_mode: "Receipt Photos (Edit Mode)",
  take_photo: "Take Photo",
  select_from_gallery: "Select from Gallery",
  processing_image: "Processing image...",
  original_photos_preserved: "Original photos are preserved in edit mode",
  add_receipt_photos: "Add or take receipt photos",
  at_least_one_photo: "You must add at least one receipt photo",
  original_photos_must_be_preserved:
    "Original photos must be preserved in edit mode",

  // The added translations for new components
  name: "Name",
  surname: "Surname",
  phone: "Phone",
  signin: "Sign In",
  signup: "Sign Up",
  welcome: "Welcome",
  welcome_back: "Welcome Back",
  have_account: "Already have an account?",
  reset_password: "Reset Password",
  reset_password_text: "Enter your email to receive a password reset link.",
  reset_password_sent: "Password reset link sent.",
  reset_password_check_email:
    "Check your email for password reset instructions.",
  registration_success_text:
    "Your account has been created successfully. You can now log in.",
  go_to_login: "Log In",

  // TypeSelector Component
  expense_items: "Expense items",
  descriptions: "Descriptions",
  amounts: "Amounts",
  bank_selected_alt: "Bank selection",
  invoice_information_alt: "Invoice information",
  amount_alt: "Amount",
  money_denominations_alt: "Money denominations",
  coins_alt: "Coins",
  total_amount_alt: "Total amount",

  // Validations
  field_required: "This field is required",
  password_length: "Password must be at least 6 characters",
  password_match: "Passwords do not match",
  invalid_credentials: "Invalid email or password",

  images: "Images",
  // Alert Messages
  alert_title: "Alert",
  success_title: "Success",
  error_title: "Error",
  continue: "Continue",

  // Bank Selector
  select_bank: "Select Bank",
  no_bank_selected: "No bank selected",

  // Date Picker
  select_date: "Select Date",

  // Search Components
  filter: "Filter",
  all_stores: "All Stores",
  all_receipt_types: "All Receipt Types",
  cash: "Cash",

  // Receipt Detail Modal
  receipt_info: "Receipt Information",
  receipt_date: "Receipt Date",
  receipt_time: "Receipt Time",
  receipt_store: "Store",
  receipt_status: "Status",
  receipt_status_approved: "Approved",
  receipt_status_pending: "Pending",
  receipt_status_rejected: "Rejected",
  receipt_images: "Receipt Images",
  bank_details: "Bank Details",
  item: "Item",
  amount_detail: "Amount",
  close: "Close",
  pos_details: "POS Details",
  bank: "Bank",
  bank_name: "Bank Name",

  // Store components
  enter_store_name: "Enter store name",
  enter_location: "Enter location",
  phone_number: "Phone Number",
  enter_phone_number: "Enter phone number",
  select_address: "Select address",
  store_status: "Store Status",
  store_not_found: "Store not found",
  please_select_store: "Please select a store",
  store_assignment_successful: "Store assignment successful",

  // Form validation
  "validation.store_name_min_length":
    "Store name must be at least 3 characters",
  "validation.location_min_length": "Location must be at least 2 characters",
  "validation.phone_length": "Phone number must be 10 digits",
  "validation.address_min_length": "Address must be at least 5 characters",

  // Denominations
  tl_200: "200 TL",
  tl_100: "100 TL",
  tl_50: "50 TL",
  tl_20: "20 TL",
  tl_10: "10 TL",
  tl_5: "5 TL",

  // Units
  unit_count: "pcs",

  // Receipt Create Screen
  receipt_create_error_msg: "An error occurred while creating receipt",
  receipt_edit_error_msg: "An error occurred while updating receipt",
  error_details: "Error details",
  please_try_again: "Please try again",
  reset_warning_message:
    "If you return to receipt type selection, all entered data will be lost. Do you want to continue?",
  receipt_created_successfully: "Receipt created successfully!",
  receipt_updated_successfully: "Receipt updated successfully!",

  // Modal Components
  invalid_date: "Invalid Date",

  // SessionHistory
  hours_abbr: "h",
  minutes_abbr: "m",
  time_expired: "Time expired",
  time_remaining: "remaining",

  // Preview bileşeni
  general_settings: "General",
  details_tab: "Details",
  photos_section: "Photos",
  changes_tab: "Changes",
  no_changes_detected: "No changes detected yet",
  main_photo: "Main Photo",
  photo_singular: "Photo",
  editing_mode: "Editing",
  current_total_amount: "Current Total Amount",
  previous_amount: "Previous",
  save_changes: "Save Changes",
  create_receipt: "Create Receipt",
  receipt_type_cash_receipt: "Cash Receipt",
  receipt_type_pos_receipt: "POS Receipt",
  receipt_type_expense_receipt: "Expense Receipt",
  unknown_type: "Unknown Type",
  receipts: "Receipt",
  no_stores_found: "No stores found",
  filter_by_activity_type: "Filter by activity type",
  activity_types: "Activity Types",
  search_by_username: "Search by username",
  enter_username: "Enter username",
  select_user: "Select User",
  summary: "Summary",
  reset_translation: "clear",

  tasks: {
    tab: "Tasks",
    manage_tab: "Manage",
    my_tab: "Mine",
    new: "Create Task",
    assign: "Assign Users",
    empty_list: "No tasks available",
    due_today: "Due Today",
    submit: "Submit Task",
    details: "Task Details",
    task_title: "Task Title",
    description: "Description",
    start_date: "Start Date",
    end_date: "End Date",
    due_time: "Due Time",
    daily: "Daily Task",
    frequency: "Frequency per Day",
    select_store: "Select Store",
    assign_users: "Assign Users",
    store_filter: "Filter by Store",
    status_filter: "Filter by Status",
    status: {
      pending: "Pending",
      completed: "Completed",
      expired: "Expired",
    },
    assigned_users: "Assigned Users",
    submissions: "Submissions",
    create_success: "Task created successfully",
    update_success: "Task updated successfully",
    delete_success: "Task deleted successfully",
    submit_success: "Task submitted successfully",
    error: {
      create: "Failed to create task",
      update: "Failed to update task",
      delete: "Failed to delete task",
      submit: "Failed to submit task",
      fetch: "Failed to fetch tasks",
    },
  },

  title: "Title",

  assignee: "Assignee",

  comments: "Comments",

  submit: "Submit",

  search_users: "Search users...",

  limit_reached: "Limit Reached",
  max_files_upload_alert: "You can upload a maximum of 5 files.",
  task_instance_id_missing: "Task instance ID is missing.",
  no_files_for_submission: "Please upload at least one file for submission.",

  // Manager Screens
  manager_tasks: "Manager Tasks",
  create_task: "Create Task",
  assign_users: "Assign Users",
  no_tasks_today_manager: "No tasks for today.",
  task_title_required: "Title is required",
  start_date_required: "Start date is required",
  due_time_required: "Due time is required",
  store_selection_required: "At least one store must be selected",
  end_date_min_start_date: "End date can't be before start date",
  frequency_optional: "Frequency (if daily, e.g., 2, default 1)",
  frequency_required_if_daily: "Frequency is required for daily tasks",
  frequency_min_1: "Frequency must be at least 1 per day",
  select_stores: "Select Stores",
  assign_to_stores: "Assign to Stores",

  due_time: "Due Time (HH:MM)",
  daily_task_question: "Daily Task?",
  daily_task: "Daily Task",
  frequency_per_day: "Frequency Per Day",
  no_stores_available: "No stores available for selection.",
  could_not_load_stores: "Could not load stores for selection.",
  task_created_successfully: "Task created successfully.",
  failed_to_create_task:
    "Failed to create task. Please check details and try again.",
  assignments_updated_successfully: "Assignments updated successfully.",
  failed_to_update_assignments: "Failed to update assignments.",
  assign_users_to_task: "Assign Users to Task",

  error_loading_stores: "Error Loading Stores",
  error_loading_stores_detail:
    "Could not load stores for selection. Please try again later.",

  my_tasks: "My Tasks",
  task_management: "Task Management",

  edit_task: "Edit Task",

  task_title: "Title",
  task_description: "Description",
  task_store: "Store",
  task_due_date: "Due Date",
  task_due_time: "Due Time",
  task_priority: "Priority",
  task_assigned_users: "Assigned Users",
  task_no_tasks_today: "No tasks for today.",
  task_no_tasks_history: "No tasks in history.",

  task_updated_successfully: "Task updated successfully.",
  task_deleted_successfully: "Task deleted successfully.",
  task_assigned_successfully: "Users assigned successfully.",
  task_submitted_successfully: "Task submitted successfully.",
  task_submission_error_context: "An error occurred while submitting the task.",
  task_create_error: "Error creating task.",
  task_update_error: "Error updating task.",
  task_delete_error: "Error deleting task.",
  task_assignment_error: "Error assigning users.",
  task_submit_error: "Error submitting task.",
  task_fetch_my_today_error: "Error fetching your tasks for today.",
  task_fetch_manager_today_error: "Error fetching manager tasks for today.",
  task_select_store: "Select Store",
  task_select_priority: "Select Priority",
  task_priority_low: "Low",
  task_priority_medium: "Medium",
  task_priority_high: "High",
  task_submit_comment_placeholder: "Enter comments (optional)",
  task_submit_modal_title: "Submit Task",
  task_confirm_delete_title: "Confirm Delete Task",
  task_confirm_delete_message:
    'Are you sure you want to delete this task: "{{taskTitle}}"?',
  task_due_time_invalid: "Invalid due time.",
  task_history: "History",
  task_today: "Today",

  // Manager Tasks Screen
  manager_tasks_title: "Manager Tasks",
  manager_no_tasks_today: "No tasks found for today.",

  // Create Task Screen
  create_task_screen_title: "Create New Task",

  // Assign Users Bottom Sheet
  assign_users_bottom_sheet_title: "Assign Users to Task",
  assign_users_search_placeholder: "Search users by name or email",
  assign_users_no_users_found: "No users found.",
  assign_users_selected: "{{count}} users selected",

  // My Tasks Screen
  my_tasks_screen_title: "My Tasks",

  // Submit Task Modal
  submit_task_modal_header: "Submit Task Progress",
  submit_task_add_comment: "Add Comment",
  submit_task_upload_images: "Upload Images",
  submit_task_submit_button: "Submit Progress",

  // ImageUploader
  image_uploader_title: "Upload Images",
  select_image_button: "Select Images",
  max_files_reached: "Maximum number of files ({{maxFiles}}) reached.",
  image_preview: "Image Preview",
  remove_image: "Remove Image",
  file_too_large:
    "File {{fileName}} is too large. Max size: {{maxFileSizeMB}}MB.",
  permission_denied:
    "Sorry, we need camera roll permissions to make this work!",
  failed_to_pick_images: "Failed to pick images.",

  // Validation messages
  validation_required: "This field is required.",
  validation_invalid_format: "Invalid format.",
  validation_min_length: "Must be at least {{count}} characters.",
  validation_max_length: "Must be at most {{count}} characters.",
  validation_future_date: "Date must be in the future.",

  ongoing: "Ongoing",

  // Device Management
  device_management: "Device Management",
  my_devices: "My Devices",
  device_requests: "Device Requests",
  approved_users: "Approved Users",
  device_settings: "Device Settings",
  add_device: "Add Device",
  update_device: "Update Device",
  delete_device: "Delete Device",
  select_device: "Select Device",
  no_devices_available: "No devices available",
  add_device_instruction: "Register a new device to get started",

  // Device Operations
  connect_as_manager: "Connect as Manager",
  register_device: "Register Device",
  device_name: "Device Name",
  device_password: "Device Password",
  confirm_delete_device: "Are you sure you want to delete this device?",
  device_deleted: "Device deleted successfully",
  device_updated: "Device updated successfully",
  device_registered: "Device registered successfully",
  device_connected: "Connected to device successfully",

  // Device Requests
  no_pending_requests: "No pending requests",
  pending_requests: "Pending Requests",
  approve: "Approve",
  reject: "Reject",
  request_approved: "Request approved successfully",
  request_rejected: "Request rejected successfully",
  caregiver_request: "Caregiver Request",
  send_request: "Send Request",

  // Device Users
  no_approved_users: "No approved users",
  block_user: "Block User",
  confirm_block_user: "Are you sure you want to block this user?",
  user_blocked: "User blocked successfully",
  approved_users_info:
    "You can view and manage users who are approved to view this device.",

  // Device Errors
  device_error: "Device Error",
  connection_failed: "Connection failed",
  request_failed: "Request failed",
};
