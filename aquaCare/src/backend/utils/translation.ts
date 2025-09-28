/**
 * Translation Service for AquaCare Frontend
 * Provides centralized text translation and localization
 */

export type Language = 'en' | 'he';

export interface TranslationDictionary {
  [key: string]: any;
}

class TranslationService {
  private currentLanguage: Language = 'he'; // Default to Hebrew
  private translations: Record<Language, TranslationDictionary> = {
    en: {},
    he: {}
  };
  private isLoading: boolean = false;
  private baseUrl: string = 'http://localhost:5001'; // Backend URL

  constructor() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
    
    if (savedLanguage && ['en', 'he'].includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    } else {
      // Check browser language and set default
      const browserLang = navigator.language.toLowerCase();
      
      if (browserLang.startsWith('en')) {
        this.currentLanguage = 'en';
      } else {
        this.currentLanguage = 'he'; // Default to Hebrew
      }
      
      // Save the detected language
      localStorage.setItem('selectedLanguage', this.currentLanguage);
    }
    
    // Load fallback translations immediately to ensure the app works without backend
    this.loadFallbackTranslations(this.currentLanguage);
  }

  /**
   * Load translations from backend API
   */
  private async loadTranslations(language: Language): Promise<void> {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      
      const response = await fetch(`${this.baseUrl}/lang/${language}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.status}`);
      }

      const translations = await response.json();
      this.translations[language] = translations;
      
      // Dispatch event when translations are ready
      window.dispatchEvent(new CustomEvent('translationsReady'));
    } catch (error) {
      console.error(`❌ Error loading translations for ${language}:`, error);
      
      // Fallback translations are already loaded in constructor, so no need to load again
      console.log(`✅ Using already loaded fallback translations for ${language}`);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Fallback translations when API is unavailable
   */
  private loadFallbackTranslations(language: Language): void {
    // Clear existing translations for this language
    this.translations[language] = {};
    
    const fallbackTranslations: Record<Language, TranslationDictionary> = {
      en: {
        navigation: {
          home: "Home",
          booking: "Book Appointment",
          receivedRequests: "Received Requests",
          managementRequests: "Management Requests",
          management: "Management",
          profile: "Profile",
          settings: "Settings",
          payments: "Payments",
          logout: "Logout",
          lightMode: "Light Mode",
          darkMode: "Dark Mode",
          login: "Login",
          contact: "Contact Us",
          myRequests: "My Requests",
          showAppointments: "Show Appointments",
          myAppointments: "My Appointments",
          poolPayments: "Pool Payments",
          myPayments: "My Payments",
          therapistSchedule: "Therapist Schedule",
          internalMessages: "Internal Messages",
          therapistManagement: "Therapist Management",
          employeeDashboard: "Employee Dashboard",
          messages: "Messages"
        },
        developerContact: {
          heroBadge: "Software Development Services",
          heroTitle: "Let's Create Something Great Together!",
          heroSubtitle: "Fresh graduate software engineer ready to help you build amazing applications! Let's create something great together.",
          whatICanDo: "What I Can Do",
          stats: {
            projects: "Projects Completed",
            support: "Support Available",
            satisfaction: "Client Satisfaction",
            years: "Years Experience"
          },
          contact: {
            heading: "Multiple Ways to Connect",
            phone: "Phone",
            email: "Email",
            whatsapp: "WhatsApp",
            responseTime: "Response Time",
            responseTimeValue: "Within 2-4 hours"
          },
          services: {
            customDevelopment: {
              title: "Custom Development",
              description: "Tailored software solutions for your business needs"
            },
            technicalSupport: {
              title: "Technical Support",
              description: "Technical support and maintenance services"
            },
            securityCompliance: {
              title: "Security & Compliance",
              description: "Security and compliance solutions"
            },
            performanceOptimization: {
              title: "Performance Optimization",
              description: "Optimize your application for better performance"
            }
          },
          social: {
            heading: "Follow & Connect",
            githubDesc: "View our projects",
            linkedinDesc: "Connect professionally"
          },
          form: {
            heading: "Get In Touch",
            nameLabel: "Full Name *",
            emailLabel: "Email *",
            companyLabel: "Company/Organization",
            subjectLabel: "Subject",
            messageLabel: "Message *",
            messagePlaceholder: "Tell us about your project, requirements, or any questions you have...",
            submit: "Send Message",
            sending: "Sending...",
            success: "Message sent successfully! We'll get back to you soon.",
            close: "Close",
            errorFillRequired: "Please fill in all required fields",
            errorFailedToSend: "Failed to send message. Please try again."
          },
          cta: {
            title: "Ready to Start Your Project?",
            subtitle: "Let's discuss your project and see how I can help!",
            button: "Let's Talk"
          }
        },
        buttons: {
          submit: "Submit",
          cancel: "Cancel",
          save: "Save",
          delete: "Delete",
          edit: "Edit",
          add: "Add",
          close: "Close",
          confirm: "Confirm",
          reset: "Reset",
          search: "Search",
          filter: "Filter",
          export: "Export",
          import: "Import",
          back: "Back",
          next: "Next",
          create: "Create",
          update: "Update",
          actions: "Actions",
          sendRequest: "Send Request",
          sendResponse: "Send Response",
          refreshList: "Refresh List",
          sendNewRequest: "Send New Request",
          clearCache: "Clear Cache and Reload",
          clear: "Clear",
          refresh: "Refresh",
          login: "Login",
          register: "Register",
          logout: "Logout",
          book: "Book",
          view: "View",
          send: "Send",
          approve: "Approve",
          reject: "Reject"
        },
        requests: {
          receivedRequests: "Received Requests",
          errorFetchingRequests: "Error fetching requests",
          serverConnectionError: "Server connection error",
          noResponseToSend: "No response to send",
          responseSent: "Response sent successfully",
          forUser: "for user",
          errorSendingResponse: "Error sending response",
          complaint: "Complaint",
          positiveFeedback: "Positive Feedback",
          cancelSubscription: "Cancel Subscription",
          other: "Other",
          pool: "Pool",
          notDefined: "Not Defined",
          noRequestsToDisplay: "No requests to display",
          allActivitiesProcessed: "All activities have been processed",
          requestId: "Request ID: ",
          managerResponse: "Manager Response",
          responseToRequest: "Response to Request",
          writeYourResponse: "Write your response here...",
          unknownUser: "Unknown User",
          noEmail: "No email provided",
          pendingRequests: "Pending Requests",
          allRequests: "All Requests",
          noPendingRequests: "No pending requests",
          allRequestsAnswered: "All requests have been answered"
        },
        lockedUsers: {
          lockedUsers: "Locked Users",
          noPoolId: "No pool ID found for user",
          errorFetchingLockedUsers: "Error fetching locked users",
          unlockExpiredSuccess: "Successfully unlocked expired accounts",
          errorUnlockingExpired: "Error unlocking expired accounts",
          resetEmailSent: "Reset email sent to {email}",
          errorSendingResetEmail: "Error sending reset email",
          noPermissionToView: "You don't have permission to view this page",
          noLockedUsers: "No locked users found",
          noName: "No name provided",
          lockedUntil: "Locked Until",
          failedAttempts: "Failed Login Attempts",
          status: "Status",
          locked: "Locked",
          unlocked: "Unlocked",
          sendResetLink: "Send Reset Link",
          email: "Email",
          name: "Name",
          actions: "Actions",
          unlockExpired: "Unlock Expired"
        },
        auth: {
          login: "Login",
          register: "Register",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm Password",
          username: "Username",
          firstName: "First Name",
          lastName: "Last Name",
          phone: "Phone (Optional)",
          dateOfBirth: "Date of Birth",
          gender: "Gender",
          role: "Role",
          selectPool: "Select Pool",
          rememberMe: "Remember Me",
          loginSuccess: "✅ Login successful!",
          registrationSuccess: "✅ Registration successful! Redirecting to login...",
          registrationForm: "Registration Form",
          loginForm: "Login",
          noAccount: "If you don't have an account, click here to register",
          token: "Token (sent by manager)",
          specialty: "Specialty",
          poolId: "Pool ID",
          therapistRegistration: "Therapist Registration",
          forgotPassword: "Forgot Password?",
          enterEmailForReset: "Enter email address for password reset",
          resetEmailSent: "If the email exists in the system, a reset message was sent",
          resetEmailError: "Error sending reset request",
          male: "Male",
          female: "Female",
          termsAndPrivacy: "I agree to the terms and conditions and privacy policy",
          registering: "Registering...",
          haveAccount: "Already have an account?"
        },
        dashboard: {
          adminPanel: "Admin Panel",
          sensorStatus: "Sensor Status",
          poolUsers: "Pool Registered Users",
          detailedReports: "Detailed Reports",
          userManagement: "User Management",
          facilityStatus: "Facility Status",
          dailySummary: "Daily Summary",
          optimizationManagement: "Optimization Management",
          emergencyManagement: "Emergency Management",
          workSchedule: "Work Schedule",
          sendReminders: "Send Reminders",
  
          allToolsInOnePlace: "All Tools in One Place"
        },
        appointments: {
          title: "Appointments",
          showAppointments: "Show Appointments",
          myAppointments: "My Appointments",
          appointmentDetails: "Appointment Details",
          bookAppointment: "Book Appointment",
          cancelAppointment: "Cancel Appointment",
          listOfFutureAppointments: "List of Future Appointments",
          noFutureAppointments: "No future appointments found to display",
          confirmCancelAppointment: "Are you sure you want to cancel this appointment?",
          appointmentCancelledSuccess: "Appointment cancelled successfully!",
          errorCancellingAppointment: "Error cancelling appointment. Please try again.",
          date: "Date",
          time: "Time",
          treatmentType: "Treatment Type",
          patientName: "Patient Name",
          employeeId: "Employee ID",
          notes: "Notes",
          actions: "Actions",
          patient: "Patient:",
          hydrotherapy: "Hydrotherapy",
          physiotherapy: "Physiotherapy",
          therapeuticMassage: "Therapeutic Massage",
          other: "Other",
          status: {
            pending: "Pending",
            confirmed: "Confirmed",
            completed: "Completed",
            cancelled: "Cancelled",
            rescheduled: "Rescheduled"
          }
        },
        activityLog: {
          activityLog: "Activity Log",
          userActivityLog: "User Activity Log",
          poolActivityLog: "Pool Activity Log",
          activityDescription: "View and track all user activities in your pool",
          searchPlaceholder: "Search by user, action, or details...",
          filterByAction: "Filter by Action",
          filterByUser: "Filter by User",
          clearFilters: "Clear Filters",
          filteredActivities: "Showing {count} filtered activities",
          totalActivities: "Total {count} activities",
          noResultsFound: "No results found for your search",
          noActivitiesToShow: "No activities to show",
          tryDifferentSearch: "Try different search terms or filters",
          allActivitiesProcessed: "All activities have been processed",
          historyLoadError: "Error loading activity history",
          userRegistered: "User registered",
          optimizationPerformed: "Optimization performed",
          remindersSent: "Reminders sent",
          telegramReminderSent: "Telegram reminder sent",
          emailRemindersSent: "Email reminders sent",
          bothRemindersSent: "Both reminders sent",
          response: "Response",
          logout: "Logout",
          login: "Login",
          // Additional translations for better coverage
          "activityLog.activityLog": "Activity Log",
          "activityLog.activityDescription": "View activity history of all users in your pool",
          "activityLog.searchPlaceholder": "Search by user, action or details...",
          "activityLog.filterByAction": "Filter by Action",
          "activityLog.filterByUser": "Filter by User",
          "activityLog.clearFilters": "Clear Filters",
          "activityLog.filteredActivities": "Found {count} activities",
          "activityLog.totalActivities": "Total {count} activities",
          "activityLog.noResultsFound": "No results found",
          "activityLog.noActivitiesToShow": "No activities to show",
          "activityLog.tryDifferentSearch": "Try a different search or change filters",
          "activityLog.allActivitiesProcessed": "All activities processed successfully",
          "activityLog.historyLoadError": "Error loading activity history"
        },
        actionHistory: {
          title: "Action History",
          subtitle: "View your action history in the system",
          loginRequired: "You must be logged in to view this page",
          export: "Export to CSV",
          resultsFound: "Found {count} actions",
          unknownUser: "Unknown User",
          actions: {
            bookingCreated: "Booking Created",
            paymentProcessed: "Payment Processed",
            profileUpdated: "Profile Updated",
            appointmentCancelled: "Appointment Cancelled",
            emergencyAlert: "Emergency Alert"
          },
          descriptions: {
            bookingCreated: "New appointment booked for swimming lesson",
            paymentProcessed: "Payment of $50.00 processed successfully",
            profileUpdated: "User profile information modified",
            appointmentCancelled: "Swimming lesson appointment cancelled",
            emergencyAlert: "Emergency situation reported in pool area"
          },
          filters: {
            title: "Filter and Search",
            search: "Search",
            searchPlaceholder: "Search in actions...",
            category: "Category",
            status: "Status",
            date: "Date",
            allCategories: "All Categories",
            allStatuses: "All Statuses"
          },
          categories: {
            booking: "Booking",
            payment: "Payment",
            profile: "Profile",
            emergency: "Emergency"
          },
          status: {
            completed: "Completed",
            pending: "Pending",
            failed: "Failed"
          },
          table: {
            action: "Action",
            description: "Description",
            date: "Date",
            user: "User",
            category: "Category",
            status: "Status"
          },
          clearFilters: "Clear Filters",
          noResults: "No actions found",
          errorLoadingHistory: "Error loading history"
        },
        footer: {
          copyright: "© 2025 All Rights Reserved",
          privacy: "Privacy",
          terms: "Terms",
          contact: "Contact Us"
        },
        general: {
          appName: "AquaCare Management",
          language: "Language",
          all: "All",
          loading: "Loading...",
          error: "Error",
          success: "Success",
          cancel: "Cancel",
          save: "Save",
          delete: "Delete",
          edit: "Edit",
          add: "Add",
          close: "Close",
          confirm: "Confirm",
          reset: "Reset",
          search: "Search",
          filter: "Filter",
          export: "Export",
          import: "Import",
          back: "Back",
          next: "Next",
          create: "Create",
          update: "Update",
          actions: "Actions",
          sendRequest: "Send Request",
          sendResponse: "Send Response",
          refreshList: "Refresh List",
          sendNewRequest: "Send New Request",
          clearCache: "Clear Cache and Reload",
          locale: "en",
          approve: "Approve",
          reject: "Reject",
          markAsRead: "Mark as Read",
          sendMessage: "Send Message",
          requestSchedule: "Request Work Hours",
          refresh: "Refresh",
          sending: "Sending...",
          description: "Description",
          user: "User",
          category: "Category",
          unknownUser: "Unknown User",
          loginRequired: "You must be logged in to view this page"
        },
        therapistSchedule: {
          title: "Therapist Schedule",
          requestSchedule: "Request Work Hours",
          scheduleRequests: "Schedule Requests",
          pendingRequests: "Pending Requests",
          approvedRequests: "Approved Requests",
          rejectedRequests: "Rejected Requests",
          requestStatus: "Request Status",
          requestedHours: "Requested Hours",
          approvedHours: "Approved Hours",
          requestMessage: "Request Message",
          responseMessage: "Response Message",
          requestDate: "Request Date",
          responseDate: "Response Date",
          day: "Day",
          startTime: "Start Time",
          endTime: "End Time",
          notes: "Notes",
          noRequests: "No schedule requests",
          createRequest: "Create New Request",
          approveRequest: "Approve Request",
          rejectRequest: "Reject Request",
          requestCreated: "Request created successfully",
          requestUpdated: "Request updated successfully",
          selectDays: "Select Days",
          selectTimes: "Select Times",
          monday: "Monday",
          tuesday: "Tuesday",
          wednesday: "Wednesday",
          thursday: "Thursday",
          friday: "Friday",
          saturday: "Saturday",
          sunday: "Sunday",
          pending: "Pending",
          approved: "Approved",
          rejected: "Rejected"
        },
        internalMessages: {
          title: "Internal Messages",
          inbox: "Inbox",
          sent: "Sent",
          compose: "Compose Message",
          subject: "Subject",
          message: "Message",
          recipient: "Recipient",
          sender: "Sender",
          priority: "Priority",
          category: "Category",
          isRead: "Read",
          notRead: "Unread",
          sendDate: "Send Date",
          readDate: "Read Date",
          noMessages: "No messages",
          markAsRead: "Mark as Read",
          markAsUnread: "Mark as Unread",
          deleteMessage: "Delete Message",
          reply: "Reply",
          forward: "Forward",
          messageSent: "Message sent successfully",
          messageDeleted: "Message deleted successfully",
          urgent: "Urgent",
          priorityLow: "Low",
          priorityMedium: "Medium",
          priorityHigh: "High",
          priorityUrgent: "Urgent",
          conversations: "Conversations",
          messageMarkedAsRead: "Message marked as read",
          priorities: {
            low: "Low",
            medium: "Medium",
            high: "High",
            urgent: "Urgent"
          },
          categories: {
            schedule: "Schedule",
            patient: "Patient",
            general: "General",
            emergency: "Emergency"
          }
        },
        pools: {
          loading: "Loading pools...",
          available: "Available pools: {count}",
          noOptions: "No pools available",
          selectPool: "Select a pool",
          poolDetails: "Pool Details",
          poolName: "Pool Name",
          poolId: "Pool ID",
          poolStatus: "Pool Status",
          poolCapacity: "Pool Capacity",
          poolLocation: "Pool Location",
          poolDescription: "Pool Description"
        },
        validation: {
          passwordRequirements: "Password must be at least 8 characters with uppercase letter and number",
          unexpectedError: "An unexpected error occurred",
          requiredField: "This field is required",
          invalidEmail: "Invalid email format",
          invalidPhone: "Invalid phone number",
          passwordsDoNotMatch: "Passwords do not match",
          termsNotAccepted: "You must accept the terms and conditions"
        },
        optimization: {
          title: "Optimization Manager",
          currentStatus: "Current Status",
          temperature: "Temperature",
          chlorine: "Chlorine Level",
          acidity: "Acidity Level",
          shower: "Shower Temperature",
          lighting: "Lighting",
          on: "ON",
          off: "OFF",
          actions: "Actions",
          optimize: "Optimize System",
          optimizing: "Optimizing...",
          recommendations: "Recommendations",
          temperatureHigh: "🌡️ Temperature is too high - recommended to lower heating",
          temperatureLow: "🌡️ Temperature is too low - recommended to increase heating",
          chlorineLow: "🧪 Chlorine level is low - add chlorine to pool",
          chlorineHigh: "🧪 Chlorine level is too high - reduce chlorine",
          acidityLow: "🧪 Acidity level is too low - add pH increaser",
          acidityHigh: "🧪 Acidity level is too high - add pH reducer",
          showerHigh: "🚿 Shower temperature is too high - adjust heater",
          lightingOn: "💡 Lighting is on - recommended to turn off when not in use",
          lightingOff: "💡 Consider turning on pool lighting for evening use",
          heaterOn: "🔥 Consider turning on pool heater",
          allOptimal: "✅ All systems are operating optimally",
          tempIncreased: "Temperature increased",
          tempDecreased: "Temperature decreased",
          chlorineAdjusted: "Chlorine level adjusted",
          lightingTurnedOn: "Lighting turned on",
          lightingTurnedOff: "Lighting turned off",
          alreadyOptimal: "System is already optimal!",
          lastOptimization: "Last optimization",
          noDataFound: "No data found",
          errorLoadingSensorData: "❌ Error loading sensor data:",
          poolOptimizationManager: "Pool Optimization Manager",
          selectSensorData: "Select Sensor Data",
          sensorSimulation: "Sensor Simulation",
          poolId: "Pool ID",
          showingOptimizedValues: "✅ Showing optimized values (original simulation unchanged)",
          showOriginalData: "Show Original Data",
          refresh: "Refresh",
          dataRefreshed: "Data refreshed",
          smartOptimizationPerformed: "Smart optimization performed",
          noOptimizationsNeeded: "No optimizations needed - all parameters are optimal",
          temperatureReduced: "Temperature reduced for optimal comfort",
          temperatureIncreased: "Temperature increased for optimal comfort",
          chlorineIncreased: "Chlorine level increased for proper disinfection",
          chlorineReduced: "Chlorine level reduced for safety",
          pHIncreased: "pH level increased for optimal water balance",
          pHReduced: "pH level reduced for optimal water balance",
          poolLightingOn: "Pool lighting turned on for evening visibility",
          poolLightingOff: "Pool lighting turned off to save energy",
          poolHeaterOn: "Pool heater turned on to maintain optimal temperature",
          poolHeaterOff: "Pool heater turned off to save energy"
        },
        facility: {
          title: "Facility Status Management",
          currentStatus: "Current Status",
          actions: "Actions",
          active: "Active",
          inactive: "Inactive",
          activated: "Activated",
          deactivated: "Deactivated",
          facility: "Facility",
          savingChanges: "Saving facility changes",
          changesSaved: "Changes saved successfully",
          changesSavedSuccessfully: "Facility status changes saved successfully",
          saving: "Saving...",
          saveChanges: "Save Changes",
          unsavedChanges: "You have unsaved changes",
          noStatusFound: "No status found for your pool",
          waterJets: "Water Jets System",
          waterJetsDesc: "Therapeutic water jets for massage",
          hotShowers: "Hot Showers",
          hotShowersDesc: "Warm shower facilities",
          jacuzzi: "Therapeutic Jacuzzi",
          jacuzziDesc: "Heated jacuzzi for therapy",
          waterLift: "Water Lift for Disabled",
          waterLiftDesc: "Accessibility lift for disabled users",
          softLighting: "Soft Lighting",
          softLightingDesc: "Gentle ambient lighting",
          calmingMusic: "Calming Music",
          calmingMusicDesc: "Relaxing background music",
          temperaturePanel: "Temperature Panel",
          temperaturePanelDesc: "Temperature control display",
          antiSlipFloor: "Anti-Slip Safety Floor",
          antiSlipFloorDesc: "Non-slip safety flooring"
        },
        sensors: {
          title: "Sensor Status",
          currentReadings: "Current Readings",
          controls: "Controls",
          simulation: "Simulation",
          waterTemp: "Water Temperature",
          chlorineLevel: "Chlorine Level",
          acidityLevel: "Acidity Level",
          showerTemp: "Shower Temperature",
          turnOnLight: "Turn On Light",
          turnOffLight: "Turn Off Light",
          turnOnHeater: "Turn On Heater",
          turnOffHeater: "Turn Off Heater",
          selectSimulation: "Select Simulation",
          selectOption: "Select an option",
          saving: "Saving...",
          performCheck: "Perform Check",
          currentResult: "Current Result",
          history: "Test History",
          dateTime: "Date & Time",
          testType: "Test Type",
          result: "Result",
          noHistory: "No test history",
          errorLoadingHistory: "Error loading sensor history",
          errorSaving: "Error saving data",
          performTests: "Perform Tests",
          testing: "Testing...",
          sensorsConfigured: "Sensors configured for",
          noSimulationSelected: "No simulation selected",
          simulationNotFound: "Simulation not found",
          normal: "Normal",
          warning: "Warning",
          activated: "activated",
          deactivated: "deactivated",
          emergencyActivated: "Emergency activated",
          clickForDetails: "Click on sensor to view personal details",
          emergency: {
            emergencyActivated: "🚨 Emergency mode activated!",
            emergencyDeactivated: "✅ Emergency mode deactivated!",
            activated: "🚨 Emergency mode activated!",
            deactivated: "✅ Emergency mode deactivated!",
            highWaterTemp: "Water temperature too high!",
            highChlorineLevel: "Chlorine level too high!",
            highShowerTemp: "Shower temperature too high!",
            invalidAcidity: "Invalid acidity level!",
            manualControl: "Manual Control",
            currentStatus: "Current Status:",
            active: "Active",
            inactive: "Inactive",
            activate: "Activate",
            deactivate: "Deactivate"
          },
          sensorCheck: "Sensor check",
          temp: "Temperature",
          chlorine: "Chlorine",
          acidity: "Acidity",
          lightOn: "Light turned on",
          lightOff: "Light turned off",
          lighting: "Lighting",
          heaterOn: "Heater turned on",
          heaterOff: "Heater turned off",
          heater: "Heater"
        },
        reminders: {
          title: "Reminder Sender",
          actions: "Actions",
          sendReminders: "Send Reminders",
          sending: "Sending...",
          refreshList: "Refresh List",
          tomorrowAppointments: "Tomorrow's Appointments ({count})",
          noAppointmentsTomorrow: "No appointments for tomorrow",
          sentSuccessfully: "✅ {count} reminders sent successfully!",
          lastSent: "Last sent: {count} reminders",
          errorLoadingAppointments: "Error loading appointments",
          errorSending: "❌ Error sending reminders",
          appointmentType: "Appointment: {type}",
          viewDetails: "View Details",
          noUserData: "No user data found",
          noPoolId: "No pool ID found for user",
          sendTelegram: "Send Telegram",
          sendEmail: "Send Email",
          sendBoth: "Send Both",
          telegramSentSuccess: "Telegram reminder sent successfully",
          telegramError: "Error sending telegram reminder",
          emailSentSuccess: "✅ {count} email reminders sent successfully!",
          emailError: "Error sending email reminders",
          bothSentSuccess: "✅ {count} reminders sent via email and telegram!",
          genericError: "Error sending reminders",
          telegramHeader: "Tomorrow's Appointments Reminder",
          telegramFooter: "Please check your appointments for tomorrow",
          appointments: "Appointments",
          date: "Date",
          emailCount: "Emails sent: {count}",
          id: "ID",
          customers: "customers"
        },
        presence: {
          inPool: "📍 I'm in the pool",
          notInPool: "🏠 I'm not in the pool",
          arrivedAtPool: "Arrived at pool",
          leftPool: "Left pool",
          userArrived: "User arrived",
          userLeft: "User left"
        },
        summary: {
          title: "Daily Summary",
          totalCustomers: "Total Customers",
          totalTreatments: "Total Treatments",
          reportedIssues: "Reported Issues",
          sensorStatus: "Sensor Status",
          dailyRevenue: "Daily Revenue",
          dailyStats: "Daily Statistics",
          avgCustomersPerTreatment: "Avg. Customers per Treatment",
          avgRevenuePerCustomer: "Avg. Revenue per Customer",
          issueRate: "Issue Rate",
          treatmentEfficiency: "Treatment Efficiency",
          sensorStatusDescription: "Current status of all pool sensors",
          unknown: "Unknown",
          errorLoading: "Error loading daily summary",
          noDataAvailable: "No data available for today",
          noUserData: "No user data found",
          noPoolId: "No pool ID found for user",
          errorLoadingDailySummary: "❌ Error loading daily summary:",
          createNewSummary: "Create new summary",
          realDataFromSystem: "Real data from the system",
          customerCount: "Customers",
          appointments: "Appointments",
          revenue: "Revenue"
        },
        home: {
          welcomeTitle: "Welcome to the Management System",
          welcomeSubtitle: "Advanced system for managing pools and hydrotherapy treatments",
          admin: {
            welcomeTitle: "Welcome to System Management",
            welcomeSubtitle: "Management of the treatment center and facilities",
            dashboardTitle: "Admin Dashboard",
            dashboard: "Dashboard",
            dashboardDesc: "General system management",
            statistics: "Statistics",
            statisticsDesc: "View system statistics",
            emergency: "Emergency Management",
            emergencyDesc: "Manage emergency situations",
            users: "User Management",
            usersDesc: "Manage system users"
          },
          therapist: {
            welcomeTitle: "Welcome Therapist",
            welcomeSubtitle: "Manage your treatments and patients",
            dashboardTitle: "Therapist Dashboard",
            schedule: "Schedule",
            scheduleDesc: "Manage your schedule",
            appointments: "Appointments",
            appointmentsDesc: "Manage your appointments",
            statistics: "Statistics",
            statisticsDesc: "View treatment statistics"
          },
          patient: {
            welcomeTitle: "Welcome Patient",
            welcomeSubtitle: "Manage your treatments and appointments",
            featuresTitle: "Available Services",
            bookTherapy: "Book Therapy Session",
            bookTherapyDesc: "Book a water therapy session",
            myAppointments: "My Appointments",
            myAppointmentsDesc: "View and manage your appointments",
            profile: "My Profile",
            profileDesc: "Manage personal profile",
            feedback: "Feedback",
            feedbackDesc: "Send feedback about treatments"
          },
          features: {
            title: "Why Choose Our System?",
            therapy: "Professional Therapy",
            wellness: "Wellness Programs",
            safety: "Safety First",
            community: "Community Focus",
            therapyDesc: "Professional hydrotherapy treatments with certified therapists",
            wellnessDesc: "Comprehensive wellness programs for all ages and abilities",
            safetyDesc: "Advanced safety systems and certified lifeguards",
            communityDesc: "Warm community focused on health and wellness"
          },
          description: "Discover the healing power of water with advanced facilities and expert therapists. Book an appointment today and start your journey to better health and wellness.",
          cta: {
            title: "Ready to Start Your Journey?",
            subtitle: "Join our community and experience the benefits of water therapy today."
          }
        },
        employee: {
          workHours: "שעות עבודה",
          protectedEmployeeArea: "אזור עובדים מוגן",
          protectedWelcomeMessage: "ברוך הבא לאזור העובדים המוגן",
          scheduleManagement: "ניהול לוח זמנים",
          therapistDashboard: "לוח בקרה מטפל",
          employeeArea: "אזור עובדים",
          welcomeMessage: "ברוך הבא לאזור העובדים",
          totalPatients: "סה\"כ מטופלים",
          totalAppointments: "סה\"כ תורים",
          completedToday: "הושלמו היום",
          averageRating: "דירוג ממוצע",
          todayAppointments: "תורים של היום",
          noAppointmentsToday: "אין תורים להיום",
          quickActions: "פעולות מהירות",
          viewAllAppointments: "צפה בכל התורים",
          manageSchedule: "ניהול לוח זמנים",
          internalMessages: "הודעות פנימיות",
          todaySummary: "סיכום היום",
          appointmentsToday: "תורים היום",
          completed: "הושלמו",
          pending: "ממתינים",
          noUserData: "לא נמצאו נתוני משתמש",
          errorLoadingData: "שגיאה בטעינת נתונים"
        },
        accessibility: {
          menu: {
            title: "תפריט נגישות"
          },
          fontSize: {
            title: "גודל טקסט",
            small: "קטן",
            medium: "בינוני",
            large: "גדול"
          },
          highContrast: "ניגודיות גבוהה",
          darkMode: "מצב כהה",
          reducedMotion: "הפחתת תנועה",
          language: "שפה",
          help: "עזרה",
          reset: "איפוס הגדרות",
          helpGuide: {
            fontSize: {
              title: "גודל טקסט",
              description: "שלוט בגודל הטקסט באתר - קטן, בינוני או גדול"
            },
            contrast: {
              title: "ניגודיות גבוהה",
              description: "הפעל מצב ניגודיות גבוהה לראות טובה יותר"
            },
            darkMode: {
              title: "מצב כהה",
              description: "עבור בין מצב בהיר למצב כהה"
            },
            language: {
              title: "שפה",
              description: "שנה את שפת האתר"
            },
            reducedMotion: {
              title: "הפחתת תנועה",
              description: "הפחת אנימציות ותנועות באתר"
            },
            shortcuts: {
              title: "קיצורי מקלדת",
              tab: "נווט בין רכיבים",
              activate: "הפעל כפתורים וקישורים",
              escape: "סגור תפריטים וחלונות",
              menu: "פתח תפריט ראשי"
            },
            title: "מדריך נגישות",
            intro: "האתר שלנו מספק כלי נגישות שונים לשיפור חוויית הגלישה שלך.",
            features: {
              title: "תכונות נגישות זמינות"
            },
            tip: {
              title: "טיפ:",
              content: "אתה יכול לגשת לתפריט הנגישות בכל עת על ידי לחיצה על סמל 🔗 בפינה הימנית העליונה."
            }
          }
        },
        adminEmergency: {
          title: "Emergency Management - Admin",
          subtitle: "Manual control over emergency states in the system",
          info: {
            title: "Emergency Management Information",
            description: "This page allows administrators to manually control emergency states in the system.",
            note: "Use with caution - activating emergency mode will send notifications to all relevant parties."
          }
        },
        workSchedule: {
          title: "ניהול לוח עבודה",
          adminOnly: "גישה מוגבלת למנהלים בלבד",
          basicSettings: "הגדרות בסיסיות",
          weeklyDayOff: "יום חופש שבועי",
          startTime: "שעת התחלה",
          endTime: "שעת סיום",
          generateTimeSlots: "צור זמני תור",
          saveSchedule: "שמור לוח עבודה",
          updateAvailableSlots: "עדכן זמנים זמינים",
          specialDates: "תאריכים מיוחדים",
          addSpecialDate: "הוסף תאריך מיוחד",
          date: "תאריך",
          reason: "סיבה",
          isClosed: "סגור",
          add: "הוסף",
          cancel: "ביטול",
          remove: "הסר",
          timeSlots: "זמני תור",
          active: "פעיל",
          inactive: "לא פעיל",
          noPoolId: "לא נמצא מזהה בריכה למשתמש",
          scheduleSavedSuccess: "לוח העבודה נשמר בהצלחה!",
          errorSavingSchedule: "שגיאה בשמירת לוח העבודה",
          errorLoadingSchedule: "שגיאה בטעינת לוח העבודה",
          slotsUpdatedSuccess: "עודכנו {created} זמנים זמינים! (נמחקו {deleted} זמנים ישנים)",
          errorUpdatingSlots: "שגיאה בעדכון זמנים זמינים",
          fillAllFields: "אנא מלא את כל השדות",
          days: {
            sunday: "ראשון",
            monday: "שני",
            tuesday: "שלישי",
            wednesday: "רביעי",
            thursday: "חמישי",
            friday: "שישי",
            saturday: "שבת"
          },
          clickToGenerateSlots: "לחץ על 'צור זמני תור' כדי ליצור זמנים",
          isOpen: "פתוח",
          noSpecialDates: "לא הוגדרו תאריכים מיוחדים",
          poolClosedOnThisDate: "הבריכה סגורה בתאריך זה"
        },
        errors: {
          cannotIdentifyUser: "שגיאה: לא ניתן לזהות את המשתמש",
          invalidUserId: "שגיאה: מזהה משתמש לא תקין",
          cannotLoadUserDetails: "לא ניתן לטעון את פרטי המשתמש",
          loadingUserDetails: "שגיאה בטעינת פרטי המשתמש",
          invalidFileType: "אנא בחר קובץ תמונה בפורמט JPG, PNG, GIF או WebP בלבד",
          imageSizeTooLarge: "גודל התמונה צריך להיות פחות מ-5MB",
          readingFile: "שגיאה בקריאת הקובץ",
          firstNameRequired: "שם פרטי הוא שדה חובה",
          lastNameRequired: "שם משפחה הוא שדה חובה",
          usernameRequired: "שם משתמש הוא שדה חובה",
          usernameInvalidCharacters: "שם המשתמש יכול להכיל רק אותיות, מספרים וקו תחתון",
          invalidPhoneNumber: "מספר הטלפון אינו תקין",
          imageProcessing: "שגיאה בעיבוד התמונה",
          imageTooLarge: "התמונה גדולה מדי. אנא בחר תמונה קטנה יותר או נסה שוב",
          invalidData: "נתונים לא תקינים",
          userNotFound: "המשתמש לא נמצא במסד הנתונים",
          serverError: "שגיאה בשרת. אנא נסה שוב מאוחר יותר",
          serverConnectionProblem: "בעיית חיבור לשרת. אנא בדוק את החיבור לאינטרנט",
          updatingUser: "שגיאה בעדכון המשתמש. אנא נסה שוב"
        },
        profile: {
          editPersonalProfile: "עריכת פרופיל אישי",
          updateYourPersonalDetails: "עדכן את הפרטים האישיים שלך",
          profilePicture: "תמונת פרופיל",
          dropHere: "שחרר כאן",
          changeImage: "שנה תמונה",
          addImage: "הוסף תמונה",
          max5mbJpgPngGifWebp: "מקסימום 5MB • JPG, PNG, GIF, WebP",
          dragOrClickToAddImage: "ניתן לגרור תמונה לכאן או לחץ על האווטר",
          selected: "נבחר",
          personalDetails: "פרטים אישיים",
          firstName: "שם פרטי",
          lastName: "שם משפחה",
          username: "שם משתמש",
          usernameUnique: "שם המשתמש ייחודי",
          phoneNumber: "מספר טלפון",
          examplePhoneNumber: "לדוגמה: 050-1234567",
          language: "שפה",
          hebrew: "עברית",
          english: "English",
          cancel: "ביטול",
          savingChanges: "שומר שינויים...",
          saveChanges: "שמור שינויים",
          backToProfile: "חזור לפרופיל",
          noUserFound: "לא נמצא משתמש",
          loginAgain: "התחבר מחדש",
          loadingUserDetails: "טוען פרטי משתמש...",
          processingImage: "מעבד תמונה...",
          compressingImageFurther: "דוחס תמונה נוספת...",
          finalCompression: "דחיסה סופית...",
          sendingToServer: "שולח לשרת...",
          profileDetailsAndPictureUpdated: "פרטי המשתמש ותמונת הפרופיל עודכנו בהצלחה!",
          profileDetailsUpdated: "פרטי המשתמש עודכנו בהצלחה!",
          clearCacheAndReload: "Are you sure you want to delete all saved data?",
          confirmDeleteAccount: "Are you sure you want to delete your account? This action cannot be undone.",
          accountDeletedSuccess: "Account deleted successfully",
          errorDeletingAccount: "Error deleting account",
          errorLoadingUserFromServer: "Error loading user from server:"
        },
        statistics: {
          dashboardTitle: "לוח סטטיסטיקות",
          poolStatistics: "סטטיסטיקות בריכה",
          errorLoadingData: "שגיאה בטעינת הנתונים",
          loginRequired: "נדרש להתחבר למערכת - אנא התחבר מחדש",
          adminOnly: "גישה מוגבלת - רק מנהלים יכולים לצפות בסטטיסטיקות",
          pathNotFound: "הנתיב לא נמצא - אנא בדוק שהשרת רץ",
          monthFilter: "סינון לפי חודש",
          print: "הדפסה",
          exportPDF: "ייצוא PDF",
          sendToEmail: "שליחה לאימייל",
          registeredUsers: "משתמשים רשומים",
          activeUsers: "משתמשים פעילים",
          totalAppointments: "סה\"כ תורים",
          completed: "הושלמו",
          totalPayments: "סה\"כ תשלומים",
          pendingAppointments: "תורים ממתינים",
          cancelledAppointments: "תורים שבוטלו",
          cancellationRate: "אחוז ביטולים",
          poolRegisteredUsers: "משתמשים רשומים לבריכה",
          currentlyConnected: "מחוברים כרגע",
          monthlyBreakdown: "פירוט חודשי",
          appointments: "תורים",
          revenue: "הכנסות",
          summary: "סיכום",
          monthlyStatistics: "סטטיסטיקות חודשיות",
          generalStatistics: "סטטיסטיקות כלליות",
          lastLoaded: "נטען לאחרונה",
          noDataFound: "לא נמצאו נתונים",
          tryAgain: "נסה שוב",
          refreshPage: "רענן דף",
          currentlyShowingRealData: "כרגע מוצגים נתונים אמיתיים",
          fileSentSuccessfully: "הקובץ נשלח בהצלחה"
        },
        booking: {
          mustLoginToBook: "עליך להתחבר כדי לקבוע תור!",
          cannotBookPastDates: "לא ניתן לקבוע תור לתאריך שעבר!",
          cannotBookDayOff: "לא ניתן לקבוע תור ביום החופש של הבריכה!",
          cannotBookSpecialDate: "לא ניתן לקבוע תור ב{reason}!",
          confirmCancelAppointment: "האם אתה בטוח שברצונך לבטל את התור?",
          appointmentCancelledSuccess: "התור בוטל בהצלחה!",
          errorCancellingAppointment: "אירעה שגיאה בביטול התור.",
          mustLoginToView: "עליך להתחבר כדי לצפות בתורים ולקבוע תור!",
          myAppointments: "התורים שלי",
          previousMonth: "חודש קודם",
          nextMonth: "חודש הבא",
          available: "פנוי",
          hasAppointment: "יש תור",
          pastDate: "תאריך שעבר",
          dayOff: "יום חופש",
          status: "סטטוס",
          canceled: "בוטל",
          noShow: "לא הופיע",
          confirmed: "מאושר",
          pending: "ממתין",
          noScheduledAppointments: "אין לך תורים מתוזמנים.",
          selectTimeAndLogin: "אנא בחר זמן והיה מחובר",
          appointmentBookedSuccess: "✅ התור נקבע בהצלחה!",
          errorBookingAppointment: "❌ שגיאה בקביעת התור",
          bookAppointment: "קבע תור",
          chooseTimeFromSlots: "בחר זמן מהזמנים הזמינים:",
          treatmentType: "סוג טיפול",
          hydrotherapy: "הידרותרפיה",
          physiotherapy: "פיזיותרפיה",
          therapeuticMassage: "עיסוי טיפולי",
          other: "אחר",
          notesOptional: "הערות (אופציונלי)",
          cancel: "ביטול",
          bookAppointmentButton: "קבע תור"
        },
        days: {
          sun: "א",
          mon: "ב",
          tue: "ג",
          wed: "ד",
          thu: "ה",
          fri: "ו",
          sat: "ש"
        },
        months: {
          january: "ינואר",
          february: "פברואר",
          march: "מרץ",
          april: "אפריל",
          may: "מאי",
          june: "יוני",
          july: "יולי",
          august: "אוגוסט",
          september: "ספטמבר",
          october: "אוקטובר",
          november: "נובמבר",
          december: "דצמבר"
        },
        userDetails: {
          noUserLoggedIn: "❌ אין משתמש מחובר! מפנה לדף התחברות...",
          userEmailMissing: "❌ חסר אימייל משתמש!",
          userNotFound: "❌ המשתמש לא נמצא במערכת!",
          errorLoadingUser: "❌ שגיאה בטעינת המשתמש:",
          errorIdentifyingUser: "❌ שגיאה בזיהוי המשתמש!",
          userLoggedOut: "🚪 המשתמש התנתק.",
          loadingData: "טוען נתונים...",
          noUserDataFound: "❌ לא נמצאו נתוני משתמש."
        },
        facilityStatus: {
          errorLoadingStatus: "❌ שגיאה בטעינת הסטטוס:"
        },
        forgotPassword: {
          pleaseEnterEmail: "אנא הכנס את כתובת המייל שלך",
          pleaseEnterValidEmail: "אנא הכנס כתובת מייל תקינה",
          resetEmailSentSuccess: "מייל איפוס סיסמה נשלח בהצלחה! אנא בדוק את המייל שלך ועקוב אחר ההוראות.",
          errorSendingResetEmail: "שגיאה בשליחת מייל איפוס. אנא נסה שוב.",
          forgotPassword: "שכחתי סיסמה",
          enterEmailForReset: "הכנס את כתובת המייל שלך ונשלח לך קישור לאיפוס הסיסמה.",
          emailAddress: "כתובת מייל",
          sendResetEmail: "שלח מייל איפוס",
          backToLogin: "חזור להתחברות"
        },
        userManagement: {
          manager: "מנהל",
          regularUser: "משתמש רגיל",
          therapist: "מטפל",
          patient: "מטופל",
          allRequiredFieldsMustBeFilled: "כל השדות החובה צריכים להיות מלאים",
          invalidEmailFormat: "פורמט אימייל לא תקין",
          usernameCannotBeEmptyOrContainSpaces: "שם משתמש לא יכול להיות ריק או להכיל רווחים",
          birthDateCannotBeInFuture: "תאריך לידה לא יכול להיות בעתיד",
          userMustBeAtLeastOneYearOld: "המשתמש חייב להיות לפחות בן שנה אחת",
          userCannotBeOlderThan120Years: "המשתמש לא יכול להיות בן יותר מ-120 שנה",
          invalidPhoneFormat: "פורמט טלפון לא תקין",
          poolIdMustBeNumber: "מזהה בריכה חייב להיות מספר",
          firstNameAndLastNameCanOnlyContainHebrewOrEnglishLetters: "שם פרטי ושם משפחה יכולים להכיל רק אותיות בעברית או באנגלית",
          firstNameMustBeBetween2And50Characters: "שם פרטי חייב להיות בין 2 ל-50 תווים",
          lastNameMustBeBetween2And50Characters: "שם משפחה חייב להיות בין 2 ל-50 תווים",
          usernameMustBeBetween3And30Characters: "שם משתמש חייב להיות בין 3 ל-30 תווים",
          emailCannotBeLongerThan100Characters: "אימייל לא יכול להיות ארוך מ-100 תווים",
          phoneCannotBeLongerThan20Characters: "מספר טלפון לא יכול להיות ארוך מ-20 תווים",
          poolIdCannotBeLongerThan10Digits: "מזהה בריכה לא יכול להיות ארוך מ-10 ספרות",
          therapyPoolCannotBeLongerThan50Characters: "בריכת טיפול לא יכולה להיות ארוכה מ-50 תווים",
          cannotIdentifyUser: "לא ניתן לזהות את המשתמש",
          userUpdatedSuccessfully: "✅ המשתמש עודכן בהצלחה!",
          errorUpdatingUser: "שגיאה בעדכון המשתמש",
          editUser: "עריכת משתמש:",
          personalDetails: "פרטים אישיים",
          firstName: "שם פרטי",
          lastName: "שם משפחה",
          email: "אימייל",
          username: "שם משתמש",
          phone: "טלפון",
          dateOfBirth: "תאריך לידה",
          gender: "מין",
          male: "זכר",
          female: "נקבה",
          role: "תפקיד",
          poolDetails: "פרטי בריכה",
          poolId: "מזהה בריכה",
          therapyPool: "בריכת טיפול",
          accessibilitySettings: "הגדרות נגישות",
          language: "שפה",
          hebrew: "עברית",
          english: "English",
          textSize: "גודל טקסט",
          small: "קטן",
          medium: "בינוני",
          large: "גדול",
          accessibility: "נגישות",
          active: "פעיל",
          inactive: "לא פעיל",
          highContrast: "ניגודיות גבוהה",
          cancel: "ביטול",
          updating: "מעדכן...",
          updateUser: "עדכן משתמש"
        },
        payments: {
          paymentSystemTitle: "מערכת תשלומים",
          newPayment: "תשלום חדש",
          poolPayments: "תשלומי בריכה",
          paymentHistory: "היסטוריית תשלומים",
          myPayments: "התשלומים שלי",
          adminView: "👨‍💼 תצוגת מנהל",
          showingAllPayments: "מציג את כל התשלומים מהמשתמשים בבריכה שלך",
          noPaymentsToShow: "אין תשלומים להצגה",
          date: "תאריך",
          amount: "סכום",
          paymentMethod: "אמצעי תשלום",
          status: "סטטוס",
          dateLocale: "he-IL",
          paid: "שולם",
          pending: "ממתין"
        },
        personalSensors: {
          title: "חיישנים אישיים",
          subtitle: "בדוק את מצב החיישנים האישיים שלך",
          showAll: "הצג הכל",
          info: {
            title: "מידע על החיישנים",
            waterTemp: "חיישן טמפרטורת מים בבריכה - בודק את הטמפרטורה האופטימלית לפעילות בבריכה",
            chlorine: "חיישן רמת כלור - מבטיח רמה בטוחה של כלור במים",
            acidity: "חיישן רמת חומציות - בודק את רמת ה-pH במים",
            showerTemp: "חיישן טמפרטורת מים במקלחות - מבטיח טמפרטורה נוחה במקלחות",
            general: "מידע כללי על החיישנים"
          },
          waterTemp: {
            title: "חיישן טמפרטורת מים",
            subtitle: "בדיקת טמפרטורת המים בבריכה",
            infoTitle: "מידע על חיישן טמפרטורת מים",
            info: "חיישן טמפרטורת מים בבריכה - בודק את הטמפרטורה האופטימלית לפעילות בבריכה. הטמפרטורה האופטימלית לפעילות בבריכה היא בין 26-30 מעלות צלזיוס."
          },
          chlorine: {
            title: "חיישן רמת כלור",
            subtitle: "בדיקת רמת הכלור במים",
            infoTitle: "מידע על חיישן רמת כלור",
            info: "חיישן רמת כלור - מבטיח רמה בטוחה של כלור במים. הרמה האופטימלית לכלור במים היא בין 1-3 ppm. רמה גבוהה מדי עלולה לגרום לגירוי בעור."
          },
          acidity: {
            title: "חיישן רמת חומציות",
            subtitle: "בדיקת רמת החומציות במים",
            infoTitle: "מידע על חיישן רמת חומציות",
            info: "חיישן רמת חומציות - בודק את רמת ה-pH במים. הרמה האופטימלית ל-pH במים היא בין 7.2-7.6. רמה נמוכה מדי עלולה לגרום לקורוזיה."
          },
          showerTemp: {
            title: "חיישן טמפרטורת מקלחת",
            subtitle: "בדיקת טמפרטורת המים במקלחות",
            infoTitle: "מידע על חיישן טמפרטורת מקלחת",
            info: "חיישן טמפרטורת מים במקלחות - מבטיח טמפרטורה נוחה במקלחות. הטמפרטורה האופטימלית היא בין 35-40 מעלות צלזיוס."
          }
        },
        reminders: {
          title: "שולח תזכורות",
          actions: "פעולות",
          sendReminders: "שלח תזכורות",
          sending: "שולח...",
          refreshList: "רענן רשימה",
          tomorrowAppointments: "תורים למחר ({count})",
          noAppointmentsTomorrow: "אין תורים למחר",
          sentSuccessfully: "✅ {count} תזכורות נשלחו בהצלחה!",
          lastSent: "נשלחו לאחרונה: {count} תזכורות",
          errorLoadingAppointments: "שגיאה בטעינת התורים",
          errorSending: "❌ שגיאה בשליחת תזכורות",
          appointmentType: "תור: {type}",
          viewDetails: "צפה בפרטים",
          noUserData: "לא נמצאו נתוני משתמש",
          noPoolId: "לא נמצא מזהה בריכה למשתמש",
          sendTelegram: "שלח טלגרם",
          sendEmail: "שלח מייל",
          sendBoth: "שלח שניהם",
          telegramSentSuccess: "תזכורת טלגרם נשלחה בהצלחה",
          telegramError: "שגיאה בשליחת תזכורת טלגרם",
          emailSentSuccess: "✅ {count} תזכורות מייל נשלחו בהצלחה!",
          emailError: "שגיאה בשליחת תזכורות מייל",
          bothSentSuccess: "✅ {count} תזכורות נשלחו במייל ובטלגרם!",
          genericError: "שגיאה בשליחת תזכורות",
          telegramHeader: "תזכורת תורים למחר",
          telegramFooter: "אנא בדוק את התורים שלך למחר",
          appointments: "תורים",
          date: "תאריך",
          emailCount: "מיילים נשלחו: {count}",
          id: "מזהה",
          customers: "לקוחות"
        },
        summary: {
          title: "סיכום יומי",
          totalCustomers: "סה\"כ לקוחות",
          totalTreatments: "סה\"כ טיפולים",
          reportedIssues: "תקלות שדווחו",
          sensorStatus: "סטטוס חיישנים",
          dailyRevenue: "הכנסה יומית",
          dailyStats: "סטטיסטיקות יומיות",
          avgCustomersPerTreatment: "ממוצע לקוחות לטיפול",
          avgRevenuePerCustomer: "ממוצע הכנסה ללקוח",
          issueRate: "שיעור תקלות",
          treatmentEfficiency: "יעילות טיפולים",
          sensorStatusDescription: "סטטוס נוכחי של כלל חיישני הבריכה",
          unknown: "לא ידוע",
          errorLoading: "שגיאה בטעינת הסיכום היומי",
          noDataAvailable: "אין נתונים זמינים להיום",
          noUserData: "לא נמצאו נתוני משתמש",
          noPoolId: "לא נמצא מזהה בריכה למשתמש",
          errorLoadingDailySummary: "❌ שגיאה בטעינת הסיכום היומי:",
          createNewSummary: "צור סיכום חדש",
          realDataFromSystem: "נתונים אמיתיים מהמערכת",
          customerCount: "לקוחות",
          appointments: "תורים",
          revenue: "הכנסות"
        },
        home: {
          welcomeTitle: "Welcome to the Management System",
          welcomeSubtitle: "Advanced system for managing pools and hydrotherapy treatments",
          admin: {
            welcomeTitle: "Welcome to System Management",
            welcomeSubtitle: "Management of the treatment center and facilities",
            dashboardTitle: "Admin Dashboard",
            dashboard: "Dashboard",
            dashboardDesc: "General system management",
            statistics: "Statistics",
            statisticsDesc: "View system statistics",
            emergency: "Emergency Management",
            emergencyDesc: "Manage emergency situations",
            users: "User Management",
            usersDesc: "Manage system users"
          },
          therapist: {
            welcomeTitle: "Welcome Therapist",
            welcomeSubtitle: "Manage your treatments and patients",
            dashboardTitle: "Therapist Dashboard",
            schedule: "Schedule",
            scheduleDesc: "Manage your schedule",
            appointments: "Appointments",
            appointmentsDesc: "Manage your appointments",
            statistics: "Statistics",
            statisticsDesc: "View treatment statistics"
          },
          patient: {
            welcomeTitle: "Welcome Patient",
            welcomeSubtitle: "Manage your treatments and appointments",
            featuresTitle: "Available Services",
            bookTherapy: "Book Therapy Session",
            bookTherapyDesc: "Book a water therapy session",
            myAppointments: "My Appointments",
            myAppointmentsDesc: "View and manage your appointments",
            profile: "My Profile",
            profileDesc: "Manage personal profile",
            feedback: "Feedback",
            feedbackDesc: "Send feedback about treatments"
          },
          features: {
            title: "Why Choose Our System?",
            therapy: "Professional Therapy",
            wellness: "Wellness Programs",
            safety: "Safety First",
            community: "Community Focus",
            therapyDesc: "Professional hydrotherapy treatments with certified therapists",
            wellnessDesc: "Comprehensive wellness programs for all ages and abilities",
            safetyDesc: "Advanced safety systems and certified lifeguards",
            communityDesc: "Warm community focused on health and wellness"
          },
          description: "Discover the healing power of water with advanced facilities and expert therapists. Book an appointment today and start your journey to better health and wellness.",
          cta: {
            title: "Ready to Start Your Journey?",
            subtitle: "Join our community and experience the benefits of water therapy today."
          }
        },
        employee: {
          workHours: "Work Hours",
          protectedEmployeeArea: "Protected Employee Area",
          protectedWelcomeMessage: "Welcome to the protected employee area",
          scheduleManagement: "Schedule Management",
          therapistDashboard: "Therapist Dashboard",
          employeeArea: "Employee Area",
          welcomeMessage: "Welcome to the employee area",
          totalPatients: "Total Patients",
          totalAppointments: "Total Appointments",
          completedToday: "Completed Today",
          averageRating: "Average Rating",
          todayAppointments: "Today's Appointments",
          noAppointmentsToday: "No appointments for today",
          quickActions: "Quick Actions",
          viewAllAppointments: "View All Appointments",
          manageSchedule: "Manage Schedule",
          internalMessages: "Internal Messages",
          todaySummary: "Today's Summary",
          appointmentsToday: "Appointments Today",
          completed: "Completed",
          pending: "Pending",
          noUserData: "No user data found",
          errorLoadingData: "Error loading data"
        },
        accessibility: {
          menu: {
            title: "תפריט נגישות"
          },
          fontSize: {
            title: "גודל טקסט",
            small: "קטן",
            medium: "בינוני",
            large: "גדול"
          },
          highContrast: "ניגודיות גבוהה",
          darkMode: "מצב כהה",
          reducedMotion: "הפחתת תנועה",
          language: "שפה",
          help: "עזרה",
          reset: "איפוס הגדרות",
          helpGuide: {
            fontSize: {
              title: "גודל טקסט",
              description: "שלוט בגודל הטקסט באתר - קטן, בינוני או גדול"
            },
            contrast: {
              title: "ניגודיות גבוהה",
              description: "הפעל מצב ניגודיות גבוהה לראות טובה יותר"
            },
            darkMode: {
              title: "מצב כהה",
              description: "עבור בין מצב בהיר למצב כהה"
            },
            language: {
              title: "שפה",
              description: "שנה את שפת האתר"
            },
            reducedMotion: {
              title: "הפחתת תנועה",
              description: "הפחת אנימציות ותנועות באתר"
            },
            shortcuts: {
              title: "קיצורי מקלדת",
              tab: "נווט בין רכיבים",
              activate: "הפעל כפתורים וקישורים",
              escape: "סגור תפריטים וחלונות",
              menu: "פתח תפריט ראשי"
            },
            title: "מדריך נגישות",
            intro: "האתר שלנו מספק כלי נגישות שונים לשיפור חוויית הגלישה שלך.",
            features: {
              title: "תכונות נגישות זמינות"
            },
            tip: {
              title: "טיפ:",
              content: "אתה יכול לגשת לתפריט הנגישות בכל עת על ידי לחיצה על סמל 🔗 בפינה הימנית העליונה."
            }
          }
        },
        adminEmergency: {
          title: "Emergency Management - Admin",
          subtitle: "Manual control over emergency states in the system",
          info: {
            title: "Emergency Management Information",
            description: "This page allows administrators to manually control emergency states in the system.",
            note: "Use with caution - activating emergency mode will send notifications to all relevant parties."
          }
        },
        workSchedule: {
          title: "ניהול לוח עבודה",
          adminOnly: "גישה מוגבלת למנהלים בלבד",
          basicSettings: "הגדרות בסיסיות",
          weeklyDayOff: "יום חופש שבועי",
          startTime: "שעת התחלה",
          endTime: "שעת סיום",
          generateTimeSlots: "צור זמני תור",
          saveSchedule: "שמור לוח עבודה",
          updateAvailableSlots: "עדכן זמנים זמינים",
          specialDates: "תאריכים מיוחדים",
          addSpecialDate: "הוסף תאריך מיוחד",
          date: "תאריך",
          reason: "סיבה",
          isClosed: "סגור",
          add: "הוסף",
          cancel: "ביטול",
          remove: "הסר",
          timeSlots: "זמני תור",
          active: "פעיל",
          inactive: "לא פעיל",
          noPoolId: "לא נמצא מזהה בריכה למשתמש",
          scheduleSavedSuccess: "לוח העבודה נשמר בהצלחה!",
          errorSavingSchedule: "שגיאה בשמירת לוח העבודה",
          errorLoadingSchedule: "שגיאה בטעינת לוח העבודה",
          slotsUpdatedSuccess: "עודכנו {created} זמנים זמינים! (נמחקו {deleted} זמנים ישנים)",
          errorUpdatingSlots: "שגיאה בעדכון זמנים זמינים",
          fillAllFields: "אנא מלא את כל השדות",
          days: {
            sunday: "ראשון",
            monday: "שני",
            tuesday: "שלישי",
            wednesday: "רביעי",
            thursday: "חמישי",
            friday: "שישי",
            saturday: "שבת"
          },
          clickToGenerateSlots: "לחץ על 'צור זמני תור' כדי ליצור זמנים",
          isOpen: "פתוח",
          noSpecialDates: "לא הוגדרו תאריכים מיוחדים",
          poolClosedOnThisDate: "הבריכה סגורה בתאריך זה"
        },
        errors: {
          cannotIdentifyUser: "שגיאה: לא ניתן לזהות את המשתמש",
          invalidUserId: "שגיאה: מזהה משתמש לא תקין",
          cannotLoadUserDetails: "לא ניתן לטעון את פרטי המשתמש",
          loadingUserDetails: "שגיאה בטעינת פרטי המשתמש",
          invalidFileType: "אנא בחר קובץ תמונה בפורמט JPG, PNG, GIF או WebP בלבד",
          imageSizeTooLarge: "גודל התמונה צריך להיות פחות מ-5MB",
          readingFile: "שגיאה בקריאת הקובץ",
          firstNameRequired: "שם פרטי הוא שדה חובה",
          lastNameRequired: "שם משפחה הוא שדה חובה",
          usernameRequired: "שם משתמש הוא שדה חובה",
          usernameInvalidCharacters: "שם המשתמש יכול להכיל רק אותיות, מספרים וקו תחתון",
          invalidPhoneNumber: "מספר הטלפון אינו תקין",
          imageProcessing: "שגיאה בעיבוד התמונה",
          imageTooLarge: "התמונה גדולה מדי. אנא בחר תמונה קטנה יותר או נסה שוב",
          invalidData: "נתונים לא תקינים",
          userNotFound: "המשתמש לא נמצא במסד הנתונים",
          serverError: "שגיאה בשרת. אנא נסה שוב מאוחר יותר",
          serverConnectionProblem: "בעיית חיבור לשרת. אנא בדוק את החיבור לאינטרנט",
          updatingUser: "שגיאה בעדכון המשתמש. אנא נסה שוב"
        },
        profile: {
          editPersonalProfile: "עריכת פרופיל אישי",
          updateYourPersonalDetails: "עדכן את הפרטים האישיים שלך",
          profilePicture: "תמונת פרופיל",
          dropHere: "שחרר כאן",
          changeImage: "שנה תמונה",
          addImage: "הוסף תמונה",
          max5mbJpgPngGifWebp: "מקסימום 5MB • JPG, PNG, GIF, WebP",
          dragOrClickToAddImage: "ניתן לגרור תמונה לכאן או לחץ על האווטר",
          selected: "נבחר",
          personalDetails: "פרטים אישיים",
          firstName: "שם פרטי",
          lastName: "שם משפחה",
          username: "שם משתמש",
          usernameUnique: "שם המשתמש ייחודי",
          phoneNumber: "מספר טלפון",
          examplePhoneNumber: "לדוגמה: 050-1234567",
          language: "שפה",
          hebrew: "עברית",
          english: "English",
          cancel: "ביטול",
          savingChanges: "שומר שינויים...",
          saveChanges: "שמור שינויים",
          backToProfile: "חזור לפרופיל",
          noUserFound: "לא נמצא משתמש",
          loginAgain: "התחבר מחדש",
          loadingUserDetails: "טוען פרטי משתמש...",
          processingImage: "מעבד תמונה...",
          compressingImageFurther: "דוחס תמונה נוספת...",
          finalCompression: "דחיסה סופית...",
          sendingToServer: "שולח לשרת...",
          profileDetailsAndPictureUpdated: "פרטי המשתמש ותמונת הפרופיל עודכנו בהצלחה!",
          profileDetailsUpdated: "פרטי המשתמש עודכנו בהצלחה!",
          clearCacheAndReload: "Are you sure you want to delete all saved data?",
          confirmDeleteAccount: "Are you sure you want to delete your account? This action cannot be undone.",
          accountDeletedSuccess: "Account deleted successfully",
          errorDeletingAccount: "Error deleting account",
          errorLoadingUserFromServer: "Error loading user from server:"
        },
        statistics: {
          dashboardTitle: "לוח סטטיסטיקות",
          poolStatistics: "סטטיסטיקות בריכה",
          errorLoadingData: "שגיאה בטעינת הנתונים",
          loginRequired: "נדרש להתחבר למערכת - אנא התחבר מחדש",
          adminOnly: "גישה מוגבלת - רק מנהלים יכולים לצפות בסטטיסטיקות",
          pathNotFound: "הנתיב לא נמצא - אנא בדוק שהשרת רץ",
          monthFilter: "סינון לפי חודש",
          print: "הדפסה",
          exportPDF: "ייצוא PDF",
          sendToEmail: "שליחה לאימייל",
          registeredUsers: "משתמשים רשומים",
          activeUsers: "משתמשים פעילים",
          totalAppointments: "סה\"כ תורים",
          completed: "הושלמו",
          totalPayments: "סה\"כ תשלומים",
          pendingAppointments: "תורים ממתינים",
          cancelledAppointments: "תורים שבוטלו",
          cancellationRate: "אחוז ביטולים",
          poolRegisteredUsers: "משתמשים רשומים לבריכה",
          currentlyConnected: "מחוברים כרגע",
          monthlyBreakdown: "פירוט חודשי",
          appointments: "תורים",
          revenue: "הכנסות",
          summary: "סיכום",
          monthlyStatistics: "סטטיסטיקות חודשיות",
          generalStatistics: "סטטיסטיקות כלליות",
          lastLoaded: "נטען לאחרונה",
          noDataFound: "לא נמצאו נתונים",
          tryAgain: "נסה שוב",
          refreshPage: "רענן דף",
          currentlyShowingRealData: "כרגע מוצגים נתונים אמיתיים",
          fileSentSuccessfully: "הקובץ נשלח בהצלחה"
        },
        booking: {
          mustLoginToBook: "עליך להתחבר כדי לקבוע תור!",
          cannotBookPastDates: "לא ניתן לקבוע תור לתאריך שעבר!",
          cannotBookDayOff: "לא ניתן לקבוע תור ביום החופש של הבריכה!",
          cannotBookSpecialDate: "לא ניתן לקבוע תור ב{reason}!",
          confirmCancelAppointment: "האם אתה בטוח שברצונך לבטל את התור?",
          appointmentCancelledSuccess: "התור בוטל בהצלחה!",
          errorCancellingAppointment: "אירעה שגיאה בביטול התור.",
          mustLoginToView: "עליך להתחבר כדי לצפות בתורים ולקבוע תור!",
          myAppointments: "התורים שלי",
          previousMonth: "חודש קודם",
          nextMonth: "חודש הבא",
          available: "פנוי",
          hasAppointment: "יש תור",
          pastDate: "תאריך שעבר",
          dayOff: "יום חופש",
          status: "סטטוס",
          canceled: "בוטל",
          noShow: "לא הופיע",
          confirmed: "מאושר",
          pending: "ממתין",
          noScheduledAppointments: "אין לך תורים מתוזמנים.",
          selectTimeAndLogin: "אנא בחר זמן והיה מחובר",
          appointmentBookedSuccess: "✅ התור נקבע בהצלחה!",
          errorBookingAppointment: "❌ שגיאה בקביעת התור",
          bookAppointment: "קבע תור",
          chooseTimeFromSlots: "בחר זמן מהזמנים הזמינים:",
          treatmentType: "סוג טיפול",
          hydrotherapy: "הידרותרפיה",
          physiotherapy: "פיזיותרפיה",
          therapeuticMassage: "עיסוי טיפולי",
          other: "אחר",
          notesOptional: "הערות (אופציונלי)",
          cancel: "ביטול",
          bookAppointmentButton: "קבע תור"
        },
        days: {
          sun: "א",
          mon: "ב",
          tue: "ג",
          wed: "ד",
          thu: "ה",
          fri: "ו",
          sat: "ש"
        },
        months: {
          january: "ינואר",
          february: "פברואר",
          march: "מרץ",
          april: "אפריל",
          may: "מאי",
          june: "יוני",
          july: "יולי",
          august: "אוגוסט",
          september: "ספטמבר",
          october: "אוקטובר",
          november: "נובמבר",
          december: "דצמבר"
        },
        userDetails: {
          noUserLoggedIn: "❌ אין משתמש מחובר! מפנה לדף התחברות...",
          userEmailMissing: "❌ חסר אימייל משתמש!",
          userNotFound: "❌ המשתמש לא נמצא במערכת!",
          errorLoadingUser: "❌ שגיאה בטעינת המשתמש:",
          errorIdentifyingUser: "❌ שגיאה בזיהוי המשתמש!",
          userLoggedOut: "🚪 המשתמש התנתק.",
          loadingData: "טוען נתונים...",
          noUserDataFound: "❌ לא נמצאו נתוני משתמש."
        },
        facilityStatus: {
          errorLoadingStatus: "❌ שגיאה בטעינת הסטטוס:"
        },
        forgotPassword: {
          pleaseEnterEmail: "אנא הכנס את כתובת המייל שלך",
          pleaseEnterValidEmail: "אנא הכנס כתובת מייל תקינה",
          resetEmailSentSuccess: "מייל איפוס סיסמה נשלח בהצלחה! אנא בדוק את המייל שלך ועקוב אחר ההוראות.",
          errorSendingResetEmail: "שגיאה בשליחת מייל איפוס. אנא נסה שוב.",
          forgotPassword: "שכחתי סיסמה",
          enterEmailForReset: "הכנס את כתובת המייל שלך ונשלח לך קישור לאיפוס הסיסמה.",
          emailAddress: "כתובת מייל",
          sendResetEmail: "שלח מייל איפוס",
          backToLogin: "חזור להתחברות"
        },
        userManagement: {
          manager: "מנהל",
          regularUser: "משתמש רגיל",
          therapist: "מטפל",
          patient: "מטופל",
          allRequiredFieldsMustBeFilled: "כל השדות החובה צריכים להיות מלאים",
          invalidEmailFormat: "פורמט אימייל לא תקין",
          usernameCannotBeEmptyOrContainSpaces: "שם משתמש לא יכול להיות ריק או להכיל רווחים",
          birthDateCannotBeInFuture: "תאריך לידה לא יכול להיות בעתיד",
          userMustBeAtLeastOneYearOld: "המשתמש חייב להיות לפחות בן שנה אחת",
          userCannotBeOlderThan120Years: "המשתמש לא יכול להיות בן יותר מ-120 שנה",
          invalidPhoneFormat: "פורמט טלפון לא תקין",
          poolIdMustBeNumber: "מזהה בריכה חייב להיות מספר",
          firstNameAndLastNameCanOnlyContainHebrewOrEnglishLetters: "שם פרטי ושם משפחה יכולים להכיל רק אותיות בעברית או באנגלית",
          firstNameMustBeBetween2And50Characters: "שם פרטי חייב להיות בין 2 ל-50 תווים",
          lastNameMustBeBetween2And50Characters: "שם משפחה חייב להיות בין 2 ל-50 תווים",
          usernameMustBeBetween3And30Characters: "שם משתמש חייב להיות בין 3 ל-30 תווים",
          emailCannotBeLongerThan100Characters: "אימייל לא יכול להיות ארוך מ-100 תווים",
          phoneCannotBeLongerThan20Characters: "מספר טלפון לא יכול להיות ארוך מ-20 תווים",
          poolIdCannotBeLongerThan10Digits: "מזהה בריכה לא יכול להיות ארוך מ-10 ספרות",
          therapyPoolCannotBeLongerThan50Characters: "בריכת טיפול לא יכולה להיות ארוכה מ-50 תווים",
          cannotIdentifyUser: "לא ניתן לזהות את המשתמש",
          userUpdatedSuccessfully: "✅ המשתמש עודכן בהצלחה!",
          errorUpdatingUser: "שגיאה בעדכון המשתמש",
          editUser: "עריכת משתמש:",
          personalDetails: "פרטים אישיים",
          firstName: "שם פרטי",
          lastName: "שם משפחה",
          email: "אימייל",
          username: "שם משתמש",
          phone: "טלפון",
          dateOfBirth: "תאריך לידה",
          gender: "מין",
          male: "זכר",
          female: "נקבה",
          role: "תפקיד",
          poolDetails: "פרטי בריכה",
          poolId: "מזהה בריכה",
          therapyPool: "בריכת טיפול",
          accessibilitySettings: "הגדרות נגישות",
          language: "שפה",
          hebrew: "עברית",
          english: "English",
          textSize: "גודל טקסט",
          small: "קטן",
          medium: "בינוני",
          large: "גדול",
          accessibility: "נגישות",
          active: "פעיל",
          inactive: "לא פעיל",
          highContrast: "ניגודיות גבוהה",
          cancel: "ביטול",
          updating: "מעדכן...",
          updateUser: "עדכן משתמש"
        },
        payments: {
          paymentSystemTitle: "מערכת תשלומים",
          newPayment: "תשלום חדש",
          poolPayments: "תשלומי בריכה",
          paymentHistory: "היסטוריית תשלומים",
          myPayments: "התשלומים שלי",
          adminView: "👨‍💼 תצוגת מנהל",
          showingAllPayments: "מציג את כל התשלומים מהמשתמשים בבריכה שלך",
          noPaymentsToShow: "אין תשלומים להצגה",
          date: "תאריך",
          amount: "סכום",
          paymentMethod: "אמצעי תשלום",
          status: "סטטוס",
          dateLocale: "he-IL",
          paid: "שולם",
          pending: "ממתין"
        },
        personalSensors: {
          title: "חיישנים אישיים",
          subtitle: "בדוק את מצב החיישנים האישיים שלך",
          showAll: "הצג הכל",
          info: {
            title: "מידע על החיישנים",
            waterTemp: "חיישן טמפרטורת מים בבריכה - בודק את הטמפרטורה האופטימלית לפעילות בבריכה",
            chlorine: "חיישן רמת כלור - מבטיח רמה בטוחה של כלור במים",
            acidity: "חיישן רמת חומציות - בודק את רמת ה-pH במים",
            showerTemp: "חיישן טמפרטורת מים במקלחות - מבטיח טמפרטורה נוחה במקלחות",
            general: "מידע כללי על החיישנים"
          },
          waterTemp: {
            title: "חיישן טמפרטורת מים",
            subtitle: "בדיקת טמפרטורת המים בבריכה",
            infoTitle: "מידע על חיישן טמפרטורת מים",
            info: "חיישן טמפרטורת מים בבריכה - בודק את הטמפרטורה האופטימלית לפעילות בבריכה. הטמפרטורה האופטימלית לפעילות בבריכה היא בין 26-30 מעלות צלזיוס."
          },
          chlorine: {
            title: "חיישן רמת כלור",
            subtitle: "בדיקת רמת הכלור במים",
            infoTitle: "מידע על חיישן רמת כלור",
            info: "חיישן רמת כלור - מבטיח רמה בטוחה של כלור במים. הרמה האופטימלית לכלור במים היא בין 1-3 ppm. רמה גבוהה מדי עלולה לגרום לגירוי בעור."
          },
          acidity: {
            title: "חיישן רמת חומציות",
            subtitle: "בדיקת רמת החומציות במים",
            infoTitle: "מידע על חיישן רמת חומציות",
            info: "חיישן רמת חומציות - בודק את רמת ה-pH במים. הרמה האופטימלית ל-pH במים היא בין 7.2-7.6. רמה נמוכה מדי עלולה לגרום לקורוזיה."
          },
          showerTemp: {
            title: "חיישן טמפרטורת מקלחת",
            subtitle: "בדיקת טמפרטורת המים במקלחות",
            infoTitle: "מידע על חיישן טמפרטורת מקלחת",
            info: "חיישן טמפרטורת מים במקלחות - מבטיח טמפרטורה נוחה במקלחות. הטמפרטורה האופטימלית היא בין 35-40 מעלות צלזיוס."
          }
        },
        reminders: {
          title: "שולח תזכורות",
          actions: "פעולות",
          sendReminders: "שלח תזכורות",
          sending: "שולח...",
          refreshList: "רענן רשימה",
          tomorrowAppointments: "תורים למחר ({count})",
          noAppointmentsTomorrow: "אין תורים למחר",
          sentSuccessfully: "✅ {count} תזכורות נשלחו בהצלחה!",
          lastSent: "נשלחו לאחרונה: {count} תזכורות",
          errorLoadingAppointments: "שגיאה בטעינת התורים",
          errorSending: "❌ שגיאה בשליחת תזכורות",
          appointmentType: "תור: {type}",
          viewDetails: "צפה בפרטים",
          noUserData: "לא נמצאו נתוני משתמש",
          noPoolId: "לא נמצא מזהה בריכה למשתמש",
          sendTelegram: "שלח טלגרם",
          sendEmail: "שלח מייל",
          sendBoth: "שלח שניהם",
          telegramSentSuccess: "תזכורת טלגרם נשלחה בהצלחה",
          telegramError: "שגיאה בשליחת תזכורת טלגרם",
          emailSentSuccess: "✅ {count} תזכורות מייל נשלחו בהצלחה!",
          emailError: "שגיאה בשליחת תזכורות מייל",
          bothSentSuccess: "✅ {count} תזכורות נשלחו במייל ובטלגרם!",
          genericError: "שגיאה בשליחת תזכורות",
          telegramHeader: "תזכורת תורים למחר",
          telegramFooter: "אנא בדוק את התורים שלך למחר",
          appointments: "תורים",
          date: "תאריך",
          emailCount: "מיילים נשלחו: {count}",
          id: "מזהה",
          customers: "לקוחות"
        }
      },
      he: {
        navigation: {
          home: "עמוד הבית",
          booking: "הזמנת תור",
          receivedRequests: "פניות שהתקבלו",
          managementRequests: "פניות להנהלה",
          management: "ניהול",
          profile: "פרופיל",
          settings: "הגדרות",
          payments: "תשלומים",
          logout: "התנתקות",
          lightMode: "מצב בהיר",
          darkMode: "מצב כהה",
          login: "התחברות",
          contact: "צור קשר",
          myRequests: "הפניות שלי",
          showAppointments: "הצגת תורים",
          myAppointments: "התורים שלי",
          poolPayments: "תשלומי הבריכה",
          myPayments: "התשלומים שלי",
          therapistSchedule: "לוח זמנים מטפלים",
          internalMessages: "הודעות פנימיות",
          therapistManagement: "ניהול מטפלים",
          employeeDashboard: "לוח בקרה עובדים",
          messages: "הודעות"
        },
        developerContact: {
          heroBadge: "שירותי פיתוח תוכנה",
          heroTitle: "בואו ניצור משהו מדהים יחד!",
          heroSubtitle: "בוגר חדש בתחום הנדסת תוכנה, מוכן לעזור לכם לבנות יישומים מעולים! בואו ניצור משהו מדהים יחד.",
          whatICanDo: "מה אני מציע",
          stats: {
            projects: "פרויקטים שהושלמו",
            support: "תמיכה זמינה",
            satisfaction: "שביעות רצון לקוחות",
            years: "שנות ניסיון"
          },
          contact: {
            heading: "דרכים נוספות ליצירת קשר",
            phone: "טלפון",
            email: "אימייל",
            whatsapp: "ווטסאפ",
            responseTime: "זמן תגובה",
            responseTimeValue: "תוך 2-4 שעות"
          },
          services: {
            customDevelopment: {
              title: "פיתוח מותאם אישית",
              description: "פתרונות תוכנה מותאמים לצרכי העסק שלך"
            },
            technicalSupport: {
              title: "תמיכה טכנית",
              description: "שירותי תמיכה ותחזוקה טכנית"
            },
            securityCompliance: {
              title: "אבטחה ורגולציה",
              description: "פתרונות אבטחה ועמידה בדרישות רגולציה"
            },
            performanceOptimization: {
              title: "אופטימיזציית ביצועים",
              description: "שיפור ביצועי היישום"
            }
          },
          social: {
            heading: "עקוב והתחבר",
            githubDesc: "צפה בפרויקטים שלנו",
            linkedinDesc: "התחבר מקצועית"
          },
          form: {
            heading: "צרו קשר",
            nameLabel: "שם מלא *",
            emailLabel: "אימייל *",
            companyLabel: "חברה/ארגון",
            subjectLabel: "נושא",
            messageLabel: "הודעה *",
            messagePlaceholder: "ספרו לנו על הפרויקט שלכם, דרישות, או כל שאלה שיש לכם...",
            submit: "שלח הודעה",
            sending: "שולח...",
            success: "ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.",
            close: "סגור",
            errorFillRequired: "אנא מלא את כל השדות הנדרשים",
            errorFailedToSend: "שליחת ההודעה נכשלה. נסה שוב בבקשה."
          },
          cta: {
            title: "מוכן להתחיל את הפרויקט שלך?",
            subtitle: "בוא נדבר על הפרויקט שלך ונראה איך אוכל לעזור!",
            button: "בואו נדבר"
          }
        },
        buttons: {
          submit: "שלח",
          cancel: "ביטול",
          save: "שמור",
          delete: "מחק",
          edit: "ערוך",
          add: "הוסף",
          close: "סגור",
          confirm: "אשר",
          reset: "איפוס",
          search: "חיפוש",
          filter: "סינון",
          export: "ייצוא",
          import: "ייבוא",
          back: "חזור",
          next: "הבא",
          create: "צור",
          update: "עדכן",
          actions: "פעולות",
          sendRequest: "שלח פנייה",
          sendResponse: "שלח מענה",
          refreshList: "רענן רשימה",
          sendNewRequest: "שלח פנייה חדשה",
          clearCache: "נקה מטמון וטען מחדש",
          clear: "נקה",
          locale: "he",
          approve: "אשר",
          reject: "דחה",
          markAsRead: "סמן כנקרא",
          sendMessage: "שלח הודעה",
          requestSchedule: "בקש שעות עבודה",
          refresh: "רענן",
          login: "התחברות",
          register: "הרשמה",
          logout: "התנתקות",
          book: "הזמן",
          view: "צפה",
          send: "שלח"
        },
        requests: {
          receivedRequests: "פניות שהתקבלו",
          errorFetchingRequests: "שגיאה בטעינת פניות",
          serverConnectionError: "שגיאת חיבור לשרת",
          noResponseToSend: "אין מענה לשליחה",
          responseSent: "המענה נשלח בהצלחה",
          forUser: "עבור משתמש",
          errorSendingResponse: "שגיאה בשליחת מענה",
          complaint: "תלונה",
          positiveFeedback: "משוב חיובי",
          cancelSubscription: "ביטול מנוי",
          other: "אחר",
          pool: "בריכה",
          notDefined: "לא מוגדר",
          noRequestsToDisplay: "אין פניות להצגה",
          allActivitiesProcessed: "כל הפעילויות טופלו",
          requestId: "מזהה פנייה: ",
          managerResponse: "תגובת מנהל",
          responseToRequest: "מענה לפנייה",
          writeYourResponse: "כתוב את המענה שלך כאן...",
          unknownUser: "משתמש לא ידוע",
          noEmail: "אין אימייל",
          pendingRequests: "פניות ממתינות",
          allRequests: "כל הפניות",
          noPendingRequests: "אין פניות ממתינות",
          allRequestsAnswered: "כל הפניות נענו"
        },
        lockedUsers: {
          lockedUsers: "משתמשים נעולים",
          noPoolId: "לא נמצא מזהה בריכה למשתמש",
          errorFetchingLockedUsers: "שגיאה בטעינת משתמשים נעולים",
          unlockExpiredSuccess: "החשבונות שפג תוקפם נפתחו בהצלחה",
          errorUnlockingExpired: "שגיאה בפתיחת חשבונות שפג תוקפם",
          resetEmailSent: "אימייל איפוס נשלח ל-{email}",
          errorSendingResetEmail: "שגיאה בשליחת אימייל איפוס",
          noPermissionToView: "אין לך הרשאה לצפות בדף זה",
          noLockedUsers: "לא נמצאו משתמשים נעולים",
          noName: "לא סופק שם",
          lockedUntil: "נעול עד",
          failedAttempts: "ניסיונות התחברות כושלים",
          status: "סטטוס",
          locked: "נעול",
          unlocked: "פתוח",
          sendResetLink: "שלח קישור איפוס",
          email: "אימייל",
          name: "שם",
          actions: "פעולות",
          unlockExpired: "פתח חשבונות שפג תוקפם"
        },
        therapistSchedule: {
          title: "לוח זמנים מטפלים",
          requestSchedule: "בקש שעות עבודה",
          scheduleRequests: "בקשות שעות עבודה",
          pendingRequests: "בקשות ממתינות",
          approvedRequests: "בקשות מאושרות",
          rejectedRequests: "בקשות נדחות",
          requestStatus: "סטטוס בקשה",
          requestedHours: "שעות מבוקשות",
          approvedHours: "שעות מאושרות",
          requestMessage: "הודעה לבקשה",
          responseMessage: "תגובה לבקשה",
          requestDate: "תאריך בקשה",
          responseDate: "תאריך תגובה",
          day: "יום",
          startTime: "שעת התחלה",
          endTime: "שעת סיום",
          notes: "הערות",
          noRequests: "אין בקשות שעות עבודה",
          createRequest: "צור בקשה חדשה",
          approveRequest: "אשר בקשה",
          rejectRequest: "דחה בקשה",
          requestCreated: "בקשה נוצרה בהצלחה",
          requestUpdated: "בקשה עודכנה בהצלחה",
          selectDays: "בחר ימים",
          selectTimes: "בחר שעות",
          monday: "שני",
          tuesday: "שלישי",
          wednesday: "רביעי",
          thursday: "חמישי",
          friday: "שישי",
          saturday: "שבת",
          sunday: "ראשון",
          pending: "ממתין",
          approved: "אושר",
          rejected: "נדחה"
        },
        internalMessages: {
          title: "הודעות פנימיות",
          inbox: "תיבת דואר נכנס",
          sent: "נשלח",
          compose: "כתוב הודעה",
          subject: "נושא",
          message: "הודעה",
          recipient: "נמען",
          sender: "שולח",
          priority: "עדיפות",
          category: "קטגוריה",
          isRead: "נקרא",
          notRead: "לא נקרא",
          sendDate: "תאריך שליחה",
          readDate: "תאריך קריאה",
          noMessages: "אין הודעות",
          markAsRead: "סמן כנקרא",
          markAsUnread: "סמן כלא נקרא",
          deleteMessage: "מחק הודעה",
          reply: "השב",
          forward: "העבר",
          messageSent: "הודעה נשלחה בהצלחה",
          messageDeleted: "הודעה נמחקה בהצלחה",
          urgent: "דחוף",
          priorityLow: "נמוכה",
          priorityMedium: "בינונית",
          priorityHigh: "גבוהה",
          priorityUrgent: "דחופה",
          conversations: "שיחות",
          messageMarkedAsRead: "הודעה סומנה כנקראה",
          priorities: {
            low: "נמוכה",
            medium: "בינונית",
            high: "גבוהה",
            urgent: "דחופה"
          },
          categories: {
            schedule: "לוח זמנים",
            patient: "מטופל",
            general: "כללי",
            emergency: "חירום"
          }
        },
        auth: {
          login: "התחברות",
          register: "הרשמה",
          email: "אימייל",
          password: "סיסמה",
          confirmPassword: "אימות סיסמה",
          username: "כינוי",
          firstName: "שם פרטי",
          lastName: "שם משפחה",
          phone: "פלאפון (אופציונלי)",
          dateOfBirth: "תאריך לידה",
          gender: "מין",
          role: "תפקיד",
          selectPool: "בחר בריכה",
          rememberMe: "זכור אותי",
          loginSuccess: "✅ התחברת בהצלחה!",
          registrationSuccess: "✅ נרשמת בהצלחה! מעביר לדף התחברות...",
          registrationForm: "טופס הרשמה",
          loginForm: "התחברות",
          noAccount: "אם אין לך חשבון, לחץ כאן להרשמה",
          token: "טוקן (שהמנהל שלח)",
          specialty: "התמחות",
          poolId: "מזהה בריכה",
          therapistRegistration: "ההרשמה למטפל",
          forgotPassword: "שכחת סיסמה?",
          enterEmailForReset: "הזן כתובת אימייל לשחזור סיסמה",
          resetEmailSent: "אם המייל קיים במערכת, נשלחה הודעת שחזור",
          resetEmailError: "שגיאה בשליחת בקשה לשחזור",
          male: "זכר",
          female: "נקבה",
          termsAndPrivacy: "אני מסכים לתנאי השימוש ומדיניות הפרטיות",
          registering: "נרשם...",
          haveAccount: "כבר יש לך חשבון?"
        },
        dashboard: {
          adminPanel: "פאנל ניהול",
          sensorStatus: "מצב חיישנים",
          poolUsers: "משתמשים רשומים לבריכה",
          detailedReports: "דו\"חות שימוש מפורטים",
          userManagement: "ניהול משתמשים",
          facilityStatus: "סטטוס מתקנים",
          dailySummary: "סיכום יומי",
          optimizationManagement: "ניהול אופטימיזציה",
          emergencyManagement: "ניהול מצבי חירום",
          workSchedule: "לוח עבודה",
          sendReminders: "שליחת תזכורות",
  
          allToolsInOnePlace: "כל הכלים במקום אחד"
        },
        appointments: {
          title: "Appointments",
          showAppointments: "הצגת תורים",
          myAppointments: "התורים שלי",
          appointmentDetails: "פרטי התור",
          bookAppointment: "הזמנת תור",
          cancelAppointment: "ביטול תור",
          listOfFutureAppointments: "רשימת תורים עתידיים",
          noFutureAppointments: "אין תורים עתידיים להצגה",
          confirmCancelAppointment: "האם אתה בטוח שאתה רוצה לבטל את התור הזה?",
          appointmentCancelledSuccess: "תור בוטל בהצלחה!",
          errorCancellingAppointment: "שגיאה בבטלת התור. אנא נסה שוב.",
          date: "תאריך",
          time: "שעה",
          treatmentType: "סוג הטיפול",
          patientName: "שם המטופל",
          employeeId: "מזהה משתמש",
          notes: "הערות",
          actions: "פעולות",
          patient: "מטופל:",
          hydrotherapy: "הידרותרפי",
          physiotherapy: "פיזיולוגי",
          therapeuticMassage: "הטיפול המרגיע",
          other: "אחר",
          status: {
            pending: "ממתין",
            confirmed: "מאושר",
            completed: "הושלם",
            cancelled: "בוטל",
            rescheduled: "נדחה"
          }
        },
        activityLog: {
          activityLog: "יומן פעילות",
          userActivityLog: "יומן פעילות משתמש",
          poolActivityLog: "יומן פעילות בריכה",
          activityDescription: "צפה ועקוב אחר כל פעילויות המשתמשים בבריכה שלך",
          searchPlaceholder: "חיפוש לפי משתמש, פעולה או פרטים...",
          filterByAction: "סנן לפי פעולה",
          filterByUser: "סנן לפי משתמש",
          clearFilters: "נקה מסננים",
          filteredActivities: "מציג {count} פעילויות מסוננות",
          totalActivities: "סה\"כ {count} פעילויות",
          noResultsFound: "לא נמצאו תוצאות לחיפוש שלך",
          noActivitiesToShow: "אין פעילויות להצגה",
          tryDifferentSearch: "נסה מונחי חיפוש או מסננים אחרים",
          allActivitiesProcessed: "כל הפעילויות עובדו",
          historyLoadError: "שגיאה בטעינת היסטוריית פעילות",
          userRegistered: "משתמש נרשם",
          optimizationPerformed: "ביצוע אופטימיזציה",
          remindersSent: "תזכורות נשלחו",
          telegramReminderSent: "תזכורת טלגרם נשלחה",
          emailRemindersSent: "תזכורות מייל נשלחו",
          bothRemindersSent: "תזכורות נשלחו במייל ובטלגרם",
          response: "תגובה",
          logout: "התנתקות",
          login: "התחברות",
          // Additional translations for better coverage
          "activityLog.activityLog": "יומן פעילות",
          "activityLog.activityDescription": "צפייה בהיסטוריית הפעילות של כל המשתמשים בבריכה שלך",
          "activityLog.searchPlaceholder": "חיפוש לפי משתמש, פעולה או פרטים...",
          "activityLog.filterByAction": "סינון לפי פעולה",
          "activityLog.filterByUser": "סינון לפי משתמש",
          "activityLog.clearFilters": "נקה סינונים",
          "activityLog.filteredActivities": "נמצאו {count} פעילויות",
          "activityLog.totalActivities": "סה\"כ {count} פעילויות",
          "activityLog.noResultsFound": "לא נמצאו תוצאות",
          "activityLog.noActivitiesToShow": "אין פעילויות להצגה",
          "activityLog.tryDifferentSearch": "נסה חיפוש אחר או שנה את הסינונים",
          "activityLog.allActivitiesProcessed": "כל הפעילויות עובדו בהצלחה",
          "activityLog.historyLoadError": "שגיאה בטעינת היסטוריית הפעילות"
        },
        actionHistory: {
          title: "היסטוריית פעולות",
          subtitle: "צפייה בהיסטוריית הפעולות שלך במערכת",
          loginRequired: "יש להתחבר כדי לצפות בדף זה",
          export: "ייצא ל-CSV",
          resultsFound: "נמצאו {count} פעולות",
          unknownUser: "משתמש לא ידוע",
          actions: {
            bookingCreated: "הזמנה נוצרה",
            paymentProcessed: "תשלום עובד",
            profileUpdated: "פרופיל עודכן",
            appointmentCancelled: "תור בוטל",
            emergencyAlert: "התראת חירום"
          },
          descriptions: {
            bookingCreated: "תור חדש להדרכת שחייה נוצר",
            paymentProcessed: "תשלום של 50$ עובד בהצלחה",
            profileUpdated: "מידע פרופיל המשתמש שונה",
            appointmentCancelled: "תור הדרכת שחייה בוטל",
            emergencyAlert: "מצב חירום דווח באזור הבריכה"
          },
          filters: {
            title: "סינון וחיפוש",
            search: "חיפוש",
            searchPlaceholder: "חפש בפעולות...",
            category: "קטגוריה",
            status: "סטטוס",
            date: "תאריך",
            allCategories: "כל הקטגוריות",
            allStatuses: "כל הסטטוסים"
          },
          categories: {
            booking: "הזמנות",
            payment: "תשלומים",
            profile: "פרופיל",
            emergency: "מצבי חירום"
          },
          status: {
            completed: "הושלם",
            pending: "ממתין",
            failed: "נכשל"
          },
          table: {
            action: "פעולה",
            description: "תיאור",
            date: "תאריך",
            user: "משתמש",
            category: "קטגוריה",
            status: "סטטוס"
          },
          clearFilters: "נקה סינון",
          noResults: "לא נמצאו פעולות",
          errorLoadingHistory: "שגיאה בטעינת היסטוריה"
        },
        footer: {
          copyright: "© 2025 כל הזכויות שמורות",
          privacy: "פרטיות",
          terms: "תנאים",
          contact: "צור קשר"
        },
        general: {
          appName: "ניהול AquaCare",
          language: "שפה",
          all: "הכל",
          loading: "טוען...",
          error: "שגיאה",
          success: "הצלחה",
          cancel: "ביטול",
          save: "שמור",
          delete: "מחק",
          edit: "ערוך",
          add: "הוסף",
          close: "סגור",
          confirm: "אשר",
          reset: "איפוס",
          search: "חיפוש",
          filter: "סינון",
          export: "ייצוא",
          import: "ייבוא",
          back: "חזור",
          next: "הבא",
          create: "צור",
          update: "עדכן",
          actions: "פעולות",
          sendRequest: "שלח פנייה",
          sendResponse: "שלח מענה",
          refreshList: "רענן רשימה",
          sendNewRequest: "שלח פנייה חדשה",
          clearCache: "נקה מטמון וטען מחדש",
          refresh: "רענן",
          sending: "שולח...",
          description: "תיאור",
          user: "משתמש",
          category: "קטגוריה",
          unknownUser: "משתמש לא ידוע",
          loginRequired: "יש להתחבר כדי לצפות בדף זה"
        },
        pools: {
          loading: "טוען בריכות...",
          available: "בריכות זמינות: {count}",
          noOptions: "אין בריכות זמינות",
          selectPool: "בחר בריכה",
          poolDetails: "פרטי בריכה",
          poolName: "שם בריכה",
          poolId: "מזהה בריכה",
          poolStatus: "סטטוס בריכה",
          poolCapacity: "קיבולת בריכה",
          poolLocation: "מיקום בריכה",
          poolDescription: "תיאור בריכה"
        },
        validation: {
          passwordRequirements: "סיסמה צריכה להיות לפחות 8 תווים עם אות גדולה ומספר",
          unexpectedError: "אירעה שגיאה בלתי צפויה",
          requiredField: "שדה זה הוא חובה",
          invalidEmail: "פורמט אימייל לא תקין",
          invalidPhone: "מספר טלפון לא תקין",
          passwordsDoNotMatch: "הסיסמאות אינן תואמות",
          termsNotAccepted: "עליך לאשר את תנאי השימוש"
        },
        optimization: {
          title: "מנהל אופטימיזציה",
          currentStatus: "סטטוס נוכחי",
          temperature: "טמפרטורה",
          chlorine: "רמת כלור",
          acidity: "רמת חומציות",
          shower: "טמפרטורת מקלחות",
          lighting: "תאורה",
          on: "פועל",
          off: "כבוי",
          actions: "פעולות",
          optimize: "בצע אופטימיזציה",
          optimizing: "מבצע אופטימיזציה...",
          recommendations: "המלצות",
          temperatureHigh: "🌡️ הטמפרטורה גבוהה מדי - מומלץ להוריד את החימום",
          temperatureLow: "🌡️ הטמפרטורה נמוכה מדי - מומלץ להעלות את החימום",
          chlorineLow: "🧪 רמת הכלור נמוכה - יש להוסיף כלור לבריכה",
          chlorineHigh: "🧪 רמת הכלור גבוהה מדי - יש להפחית כלור",
          acidityLow: "🧪 רמת החומציות נמוכה - יש להוסיף מגדיל pH",
          acidityHigh: "🧪 רמת החומציות גבוהה מדי - יש להוסיף מפחית pH",
          showerHigh: "🚿 טמפרטורת המקלחת גבוהה מדי - מומלץ לכוון את הדוד",
          lightingOn: "💡 התאורה פועלת - מומלץ לכבות בעת חוסר שימוש",
          lightingOff: "💡 שקול להדליק תאורת בריכה לשימוש ערב",
          heaterOn: "🔥 שקול להדליק דוד בריכה",
          allOptimal: "✅ כל המערכות פועלות בצורה אופטימלית",
          tempIncreased: "טמפרטורה הועלתה",
          tempDecreased: "טמפרטורה הורדה",
          chlorineAdjusted: "רמת כלור עודכנה",
          lightingTurnedOn: "תאורה הודלקה",
          lightingTurnedOff: "תאורה כובתה",
          alreadyOptimal: "המערכת כבר אופטימלית!",
          lastOptimization: "אופטימיזציה אחרונה",
          noDataFound: "לא נמצאו נתונים",
          errorLoadingSensorData: "❌ שגיאה בטעינת נתוני חיישנים:",
          poolOptimizationManager: "מנהל אופטימיזציית בריכה",
          selectSensorData: "בחר נתוני חיישן",
          sensorSimulation: "סימולציית חיישן",
          poolId: "מזהה בריכה",
          showingOptimizedValues: "✅ מציג ערכים אופטימליים (סימולציה מקורית לא השתנתה)",
          showOriginalData: "הצג נתונים מקוריים",
          refresh: "רענן",
          dataRefreshed: "נתונים רועננו",
          smartOptimizationPerformed: "בוצעה אופטימיזציה חכמה",
          noOptimizationsNeeded: "אין צורך באופטימיזציה - כל הפרמטרים אופטימליים",
          temperatureReduced: "טמפרטורה הופחתה לנוחות אופטימלית",
          temperatureIncreased: "טמפרטורה הועלתה לנוחות אופטימלית",
          chlorineIncreased: "רמת כלור הועלתה לחיטוי נכון",
          chlorineReduced: "רמת כלור הופחתה לבטיחות",
          pHIncreased: "רמת pH הועלתה לאיזון מים אופטימלי",
          pHReduced: "רמת pH הופחתה לאיזון מים אופטימלי",
          poolLightingOn: "תאורת בריכה הודלקה לנראות ערב",
          poolLightingOff: "תאורת בריכה כובתה לחיסכון באנרגיה",
          poolHeaterOn: "דוד בריכה הודלק לשמירה על טמפרטורה אופטימלית",
          poolHeaterOff: "דוד בריכה כובה לחיסכון באנרגיה"
        },
        facility: {
          title: "ניהול סטטוס מתקנים",
          currentStatus: "סטטוס נוכחי",
          actions: "פעולות",
          active: "פעיל",
          inactive: "לא פעיל",
          activated: "הופעל",
          deactivated: "כובה",
          facility: "מתקן",
          savingChanges: "שמירת שינויים במתקנים",
          changesSaved: "השינויים נשמרו בהצלחה",
          changesSavedSuccessfully: "שינויים במצב מתקני הבריכה נשמרו בהצלחה",
          saving: "שומר...",
          saveChanges: "שמור שינויים",
          unsavedChanges: "יש לך שינויים שלא נשמרו",
          noStatusFound: "לא נמצא סטטוס עבור הבריכה שלך",
          waterJets: "מערכת סילוני מים",
          waterJetsDesc: "סילוני מים טיפוליים לעיסוי",
          hotShowers: "מקלחות חמות",
          hotShowersDesc: "מתקני מקלחת חמה",
          jacuzzi: "ג'קוזי טיפולי",
          jacuzziDesc: "ג'קוזי מחומם לטיפול",
          waterLift: "מעלית מים לנכים",
          waterLiftDesc: "מעלית נגישות למשתמשים עם מוגבלויות",
          softLighting: "תאורה רכה",
          softLightingDesc: "תאורה סביבתית עדינה",
          calmingMusic: "מוזיקה מרגיעה",
          calmingMusicDesc: "מוזיקת רקע מרגיעה",
          temperaturePanel: "לוח טמפרטורה",
          temperaturePanelDesc: "צג בקרת טמפרטורה",
          antiSlipFloor: "רצפת בטיחות למניעת החלקה",
          antiSlipFloorDesc: "רצפה בטיחותית למניעת החלקה"
        },
        sensors: {
          title: "סטטוס חיישנים",
          currentReadings: "קריאות נוכחיות",
          controls: "בקרות",
          simulation: "סימולציה",
          waterTemp: "טמפרטורת מים",
          chlorineLevel: "רמת כלור",
          acidityLevel: "רמת חומציות",
          showerTemp: "טמפרטורת מקלחת",
          turnOnLight: "הדלק תאורה",
          turnOffLight: "כבה תאורה",
          turnOnHeater: "הדלק דוד",
          turnOffHeater: "כבה דוד",
          selectSimulation: "בחר סימולציה",
          selectOption: "בחר אפשרות",
          saving: "שומר...",
          performCheck: "בצע בדיקה",
          currentResult: "תוצאה נוכחית",
          history: "היסטוריית בדיקות",
          dateTime: "תאריך ושעה",
          testType: "על מה בוצע",
          result: "תוצאה",
          noHistory: "אין היסטוריית בדיקות",
          errorLoadingHistory: "שגיאה בטעינת היסטוריית החיישן",
          errorSaving: "שגיאה בשמירת הנתונים",
          performTests: "בצע בדיקות",
          testing: "בודק...",
          sensorsConfigured: "חיישנים מוגדרים עבור",
          noSimulationSelected: "לא נבחרה סימולציה",
          simulationNotFound: "סימולציה לא נמצאה",
          normal: "תקין",
          warning: "אזהרה",
          activated: "הופעל",
          deactivated: "כובה",
          emergencyActivated: "מצב חירום הופעל",
          clickForDetails: "לחץ על חיישן לצפייה בפרטים אישיים",
          emergency: {
            emergencyActivated: "🚨 מצב חירום הופעל!",
            emergencyDeactivated: "✅ מצב חירום כובה!",
            activated: "🚨 מצב חירום הופעל!",
            deactivated: "✅ מצב חירום כובה!",
            highWaterTemp: "טמפרטורת מים גבוהה מדי!",
            highChlorineLevel: "רמת כלור גבוהה מדי!",
            highShowerTemp: "טמפרטורת מקלחות גבוהה מדי!",
            invalidAcidity: "רמת חומציות לא תקינה!",
            manualControl: "בקרה ידנית",
            currentStatus: "סטטוס נוכחי:",
            active: "פעיל",
            inactive: "לא פעיל",
            activate: "הפעל",
            deactivate: "כבה"
          },
          sensorCheck: "בדיקת חיישנים",
          temp: "טמפרטורה",
          chlorine: "כלור",
          acidity: "חומציות",
          lightOn: "תאורה הודלקה",
          lightOff: "תאורה כובתה",
          lighting: "תאורה",
          heaterOn: "דוד הודלק",
          heaterOff: "דוד כובה",
          heater: "דוד"
        },
        reminders: {
          title: "שולח תזכורות",
          actions: "פעולות",
          sendReminders: "שלח תזכורות",
          sending: "שולח...",
          refreshList: "רענן רשימה",
          tomorrowAppointments: "תורים למחר ({count})",
          noAppointmentsTomorrow: "אין תורים למחר",
          sentSuccessfully: "✅ {count} תזכורות נשלחו בהצלחה!",
          lastSent: "נשלחו לאחרונה: {count} תזכורות",
          errorLoadingAppointments: "שגיאה בטעינת התורים",
          errorSending: "❌ שגיאה בשליחת תזכורות",
          appointmentType: "תור: {type}",
          viewDetails: "צפה בפרטים",
          noUserData: "לא נמצאו נתוני משתמש",
          noPoolId: "לא נמצא מזהה בריכה למשתמש",
          sendTelegram: "שלח טלגרם",
          sendEmail: "שלח מייל",
          sendBoth: "שלח שניהם",
          telegramSentSuccess: "תזכורת טלגרם נשלחה בהצלחה",
          telegramError: "שגיאה בשליחת תזכורת טלגרם",
          emailSentSuccess: "✅ {count} תזכורות מייל נשלחו בהצלחה!",
          emailError: "שגיאה בשליחת תזכורות מייל",
          bothSentSuccess: "✅ {count} תזכורות נשלחו במייל ובטלגרם!",
          genericError: "שגיאה בשליחת תזכורות",
          telegramHeader: "תזכורת תורים למחר",
          telegramFooter: "אנא בדוק את התורים שלך למחר",
          appointments: "תורים",
          date: "תאריך",
          emailCount: "מיילים נשלחו: {count}",
          id: "מזהה",
          customers: "לקוחות"
        },
        summary: {
          title: "סיכום יומי",
          totalCustomers: "סה\"כ לקוחות",
          totalTreatments: "סה\"כ טיפולים",
          reportedIssues: "תקלות שדווחו",
          sensorStatus: "סטטוס חיישנים",
          dailyRevenue: "הכנסה יומית",
          dailyStats: "סטטיסטיקות יומיות",
          avgCustomersPerTreatment: "ממוצע לקוחות לטיפול",
          avgRevenuePerCustomer: "ממוצע הכנסה ללקוח",
          issueRate: "שיעור תקלות",
          treatmentEfficiency: "יעילות טיפולים",
          sensorStatusDescription: "סטטוס נוכחי של כלל חיישני הבריכה",
          unknown: "לא ידוע",
          errorLoading: "שגיאה בטעינת הסיכום היומי",
          noDataAvailable: "אין נתונים זמינים להיום",
          noUserData: "לא נמצאו נתוני משתמש",
          noPoolId: "לא נמצא מזהה בריכה למשתמש",
          errorLoadingDailySummary: "❌ שגיאה בטעינת הסיכום היומי:",
          createNewSummary: "צור סיכום חדש",
          realDataFromSystem: "נתונים אמיתיים מהמערכת",
          customerCount: "לקוחות",
          appointments: "תורים",
          revenue: "הכנסות"
        },
        home: {
          welcomeTitle: "ברוכים הבאים למערכת הניהול",
          welcomeSubtitle: "המערכת המתקדמת לניהול בריכות וטיפולי הידרותרפיה",
          admin: {
            welcomeTitle: "ברוכים הבאים לניהול המערכת",
            welcomeSubtitle: "ניהול מרכז הטיפולים והמתקנים",
            dashboardTitle: "לוח בקרה מנהל",
            dashboard: "לוח בקרה",
            dashboardDesc: "ניהול כללי של המערכת",
            statistics: "סטטיסטיקות",
            statisticsDesc: "צפייה בסטטיסטיקות המערכת",
            emergency: "ניהול חירום",
            emergencyDesc: "ניהול מצבי חירום",
            users: "ניהול משתמשים",
            usersDesc: "ניהול משתמשי המערכת"
          },
          therapist: {
            welcomeTitle: "ברוכים הבאים מטפל",
            welcomeSubtitle: "ניהול הטיפולים והמטופלים שלך",
            dashboardTitle: "לוח בקרה מטפל",
            schedule: "לוח זמנים",
            scheduleDesc: "ניהול לוח הזמנים שלך",
            appointments: "תורים",
            appointmentsDesc: "ניהול התורים שלך",
            statistics: "סטטיסטיקות",
            statisticsDesc: "צפייה בסטטיסטיקות הטיפולים"
          },
          patient: {
            welcomeTitle: "ברוכים הבאים מטופל",
            welcomeSubtitle: "ניהול הטיפולים והתורים שלך",
            featuresTitle: "שירותים זמינים",
            bookTherapy: "קביעת תור לטיפול",
            bookTherapyDesc: "קבע תור לטיפול במים",
            myAppointments: "התורים שלי",
            myAppointmentsDesc: "צפייה וניהול התורים שלך",
            profile: "הפרופיל שלי",
            profileDesc: "ניהול הפרופיל האישי",
            feedback: "משוב",
            feedbackDesc: "שלח משוב על הטיפולים"
          },
          features: {
            title: "למה לבחור במערכת שלנו?",
            therapy: "טיפול מקצועי",
            wellness: "תכניות בריאות",
            safety: "בטיחות תחילה",
            community: "מיקוד קהילתי",
            therapyDesc: "טיפולי הידרותרפיה מקצועיים עם מטפלים מוסמכים",
            wellnessDesc: "תכניות בריאות מקיפות לכל הגילאים והיכולות",
            safetyDesc: "מערכות בטיחות מתקדמות ומצילים מוסמכים",
            communityDesc: "קהילה חמה המתמקדת בבריאות ובריאות"
          },
          description: "גלה את כוח הריפוי של המים עם מתקנים מתקדמים ומטפלים מומחים. קבע תור היום והתחל את המסע שלך לבריאות ובריאות טובה יותר.",
          cta: {
            title: "מוכן להתחיל את המסע שלך?",
            subtitle: "הצטרף לקהילה שלנו וחווה את היתרונות של טיפול במים היום."
          }
        },
        employee: {
          workHours: "שעות עבודה",
          protectedEmployeeArea: "אזור עובדים מוגן",
          protectedWelcomeMessage: "ברוך הבא לאזור העובדים המוגן",
          scheduleManagement: "ניהול לוח זמנים",
          therapistDashboard: "לוח בקרה מטפל",
          employeeArea: "אזור עובדים",
          welcomeMessage: "ברוך הבא לאזור העובדים",
          totalPatients: "סה\"כ מטופלים",
          totalAppointments: "סה\"כ תורים",
          completedToday: "הושלמו היום",
          averageRating: "דירוג ממוצע",
          todayAppointments: "תורים של היום",
          noAppointmentsToday: "אין תורים להיום",
          quickActions: "פעולות מהירות",
          viewAllAppointments: "צפה בכל התורים",
          manageSchedule: "ניהול לוח זמנים",
          internalMessages: "הודעות פנימיות",
          todaySummary: "סיכום היום",
          appointmentsToday: "תורים היום",
          completed: "הושלמו",
          pending: "ממתינים",
          noUserData: "לא נמצאו נתוני משתמש",
          errorLoadingData: "שגיאה בטעינת נתונים"
        },
        accessibility: {
          menu: {
            title: "תפריט נגישות"
          },
          fontSize: {
            title: "גודל טקסט",
            small: "קטן",
            medium: "בינוני",
            large: "גדול"
          },
          highContrast: "ניגודיות גבוהה",
          darkMode: "מצב כהה",
          reducedMotion: "הפחתת תנועה",
          language: "שפה",
          help: "עזרה",
          reset: "איפוס הגדרות",
          helpGuide: {
            fontSize: {
              title: "גודל טקסט",
              description: "שלוט בגודל הטקסט באתר - קטן, בינוני או גדול"
            },
            contrast: {
              title: "ניגודיות גבוהה",
              description: "הפעל מצב ניגודיות גבוהה לראות טובה יותר"
            },
            darkMode: {
              title: "מצב כהה",
              description: "עבור בין מצב בהיר למצב כהה"
            },
            language: {
              title: "שפה",
              description: "שנה את שפת האתר"
            },
            reducedMotion: {
              title: "הפחתת תנועה",
              description: "הפחת אנימציות ותנועות באתר"
            },
            shortcuts: {
              title: "קיצורי מקלדת",
              tab: "נווט בין רכיבים",
              activate: "הפעל כפתורים וקישורים",
              escape: "סגור תפריטים וחלונות",
              menu: "פתח תפריט ראשי"
            },
            title: "מדריך נגישות",
            intro: "האתר שלנו מספק כלי נגישות שונים לשיפור חוויית הגלישה שלך.",
            features: {
              title: "תכונות נגישות זמינות"
            },
            tip: {
              title: "טיפ:",
              content: "אתה יכול לגשת לתפריט הנגישות בכל עת על ידי לחיצה על סמל 🔗 בפינה הימנית העליונה."
            }
          }
        },
        adminEmergency: {
          title: "ניהול מצבי חירום - מנהל",
          subtitle: "בקרה ידנית על מצבי חירום במערכת",
          info: {
            title: "מידע על ניהול מצבי חירום",
            description: "דף זה מאפשר למנהלים לשלוט במצבי חירום במערכת באופן ידני.",
            note: "השתמש בזהירות - הפעלת מצב חירום תשלח התראות לכל הגורמים הרלוונטיים."
          }
        },
        workSchedule: {
          title: "Work Schedule Management",
          adminOnly: "Access restricted to administrators only",
          basicSettings: "Basic Settings",
          weeklyDayOff: "Weekly Day Off",
          startTime: "Start Time",
          endTime: "End Time",
          generateTimeSlots: "Generate Time Slots",
          saveSchedule: "Save Work Schedule",
          updateAvailableSlots: "Update Available Slots",
          specialDates: "Special Dates",
          addSpecialDate: "Add Special Date",
          date: "Date",
          reason: "Reason",
          isClosed: "Closed",
          add: "Add",
          cancel: "Cancel",
          remove: "Remove",
          timeSlots: "Time Slots",
          active: "Active",
          inactive: "Inactive",
          noPoolId: "No pool ID found for user",
          scheduleSavedSuccess: "Work schedule saved successfully!",
          errorSavingSchedule: "Error saving work schedule",
          errorLoadingSchedule: "Error loading work schedule",
          slotsUpdatedSuccess: "Updated {created} available slots! (Deleted {deleted} old slots)",
          errorUpdatingSlots: "Error updating available slots",
          fillAllFields: "Please fill all fields",
          days: {
            sunday: "Sunday",
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday"
          },
          clickToGenerateSlots: "Click 'Generate Time Slots' to create slots",
          isOpen: "Open",
          noSpecialDates: "No special dates defined",
          poolClosedOnThisDate: "Pool is closed on this date"
        },
        errors: {
          cannotIdentifyUser: "שגיאה: לא ניתן לזהות את המשתמש",
          invalidUserId: "שגיאה: מזהה משתמש לא תקין",
          cannotLoadUserDetails: "לא ניתן לטעון את פרטי המשתמש",
          loadingUserDetails: "שגיאה בטעינת פרטי המשתמש",
          invalidFileType: "אנא בחר קובץ תמונה בפורמט JPG, PNG, GIF או WebP בלבד",
          imageSizeTooLarge: "גודל התמונה צריך להיות פחות מ-5MB",
          readingFile: "שגיאה בקריאת הקובץ",
          firstNameRequired: "שם פרטי הוא שדה חובה",
          lastNameRequired: "שם משפחה הוא שדה חובה",
          usernameRequired: "שם משתמש הוא שדה חובה",
          usernameInvalidCharacters: "שם המשתמש יכול להכיל רק אותיות, מספרים וקו תחתון",
          invalidPhoneNumber: "מספר הטלפון אינו תקין",
          imageProcessing: "שגיאה בעיבוד התמונה",
          imageTooLarge: "התמונה גדולה מדי. אנא בחר תמונה קטנה יותר או נסה שוב",
          invalidData: "נתונים לא תקינים",
          userNotFound: "המשתמש לא נמצא במסד הנתונים",
          serverError: "שגיאה בשרת. אנא נסה שוב מאוחר יותר",
          serverConnectionProblem: "בעיית חיבור לשרת. אנא בדוק את החיבור לאינטרנט",
          updatingUser: "שגיאה בעדכון המשתמש. אנא נסה שוב"
        },
        profile: {
          editPersonalProfile: "עריכת פרופיל אישי",
          updateYourPersonalDetails: "עדכן את הפרטים האישיים שלך",
          profilePicture: "תמונת פרופיל",
          dropHere: "שחרר כאן",
          changeImage: "שנה תמונה",
          addImage: "הוסף תמונה",
          max5mbJpgPngGifWebp: "מקסימום 5MB • JPG, PNG, GIF, WebP",
          dragOrClickToAddImage: "ניתן לגרור תמונה לכאן או לחץ על האווטר",
          selected: "נבחר",
          personalDetails: "פרטים אישיים",
          firstName: "שם פרטי",
          lastName: "שם משפחה",
          username: "שם משתמש",
          usernameUnique: "שם המשתמש ייחודי",
          phoneNumber: "מספר טלפון",
          examplePhoneNumber: "לדוגמה: 050-1234567",
          language: "שפה",
          hebrew: "עברית",
          english: "English",
          cancel: "ביטול",
          savingChanges: "שומר שינויים...",
          saveChanges: "שמור שינויים",
          backToProfile: "חזור לפרופיל",
          noUserFound: "לא נמצא משתמש",
          loginAgain: "התחבר מחדש",
          loadingUserDetails: "טוען פרטי משתמש...",
          processingImage: "מעבד תמונה...",
          compressingImageFurther: "דוחס תמונה נוספת...",
          finalCompression: "דחיסה סופית...",
          sendingToServer: "שולח לשרת...",
          profileDetailsAndPictureUpdated: "פרטי המשתמש ותמונת הפרופיל עודכנו בהצלחה!",
          profileDetailsUpdated: "פרטי המשתמש עודכנו בהצלחה!",
          clearCacheAndReload: "Are you sure you want to delete all saved data?",
          confirmDeleteAccount: "Are you sure you want to delete your account? This action cannot be undone.",
          accountDeletedSuccess: "Account deleted successfully",
          errorDeletingAccount: "Error deleting account",
          errorLoadingUserFromServer: "Error loading user from server:"
        },
        statistics: {
          dashboardTitle: "לוח סטטיסטיקות",
          poolStatistics: "סטטיסטיקות בריכה",
          errorLoadingData: "שגיאה בטעינת הנתונים",
          loginRequired: "נדרש להתחבר למערכת - אנא התחבר מחדש",
          adminOnly: "גישה מוגבלת - רק מנהלים יכולים לצפות בסטטיסטיקות",
          pathNotFound: "הנתיב לא נמצא - אנא בדוק שהשרת רץ",
          monthFilter: "סינון לפי חודש",
          print: "הדפסה",
          exportPDF: "ייצוא PDF",
          sendToEmail: "שליחה לאימייל",
          registeredUsers: "משתמשים רשומים",
          activeUsers: "משתמשים פעילים",
          totalAppointments: "סה\"כ תורים",
          completed: "הושלמו",
          totalPayments: "סה\"כ תשלומים",
          pendingAppointments: "תורים ממתינים",
          cancelledAppointments: "תורים שבוטלו",
          cancellationRate: "אחוז ביטולים",
          poolRegisteredUsers: "משתמשים רשומים לבריכה",
          currentlyConnected: "מחוברים כרגע",
          monthlyBreakdown: "פירוט חודשי",
          appointments: "תורים",
          revenue: "הכנסות",
          summary: "סיכום",
          monthlyStatistics: "סטטיסטיקות חודשיות",
          generalStatistics: "סטטיסטיקות כלליות",
          lastLoaded: "נטען לאחרונה",
          noDataFound: "לא נמצאו נתונים",
          tryAgain: "נסה שוב",
          refreshPage: "רענן דף",
          currentlyShowingRealData: "כרגע מוצגים נתונים אמיתיים",
          fileSentSuccessfully: "הקובץ נשלח בהצלחה"
        },
        booking: {
          mustLoginToBook: "עליך להתחבר כדי לקבוע תור!",
          cannotBookPastDates: "לא ניתן לקבוע תור לתאריך שעבר!",
          cannotBookDayOff: "לא ניתן לקבוע תור ביום החופש של הבריכה!",
          cannotBookSpecialDate: "לא ניתן לקבוע תור ב{reason}!",
          confirmCancelAppointment: "האם אתה בטוח שברצונך לבטל את התור?",
          appointmentCancelledSuccess: "התור בוטל בהצלחה!",
          errorCancellingAppointment: "אירעה שגיאה בביטול התור.",
          mustLoginToView: "עליך להתחבר כדי לצפות בתורים ולקבוע תור!",
          myAppointments: "התורים שלי",
          previousMonth: "חודש קודם",
          nextMonth: "חודש הבא",
          available: "פנוי",
          hasAppointment: "יש תור",
          pastDate: "תאריך שעבר",
          dayOff: "יום חופש",
          status: "סטטוס",
          canceled: "בוטל",
          noShow: "לא הופיע",
          confirmed: "מאושר",
          pending: "ממתין",
          noScheduledAppointments: "אין לך תורים מתוזמנים.",
          selectTimeAndLogin: "אנא בחר זמן והיה מחובר",
          appointmentBookedSuccess: "✅ התור נקבע בהצלחה!",
          errorBookingAppointment: "❌ שגיאה בקביעת התור",
          bookAppointment: "קבע תור",
          chooseTimeFromSlots: "בחר זמן מהזמנים הזמינים:",
          treatmentType: "סוג טיפול",
          hydrotherapy: "הידרותרפיה",
          physiotherapy: "פיזיותרפיה",
          therapeuticMassage: "עיסוי טיפולי",
          other: "אחר",
          notesOptional: "הערות (אופציונלי)",
          cancel: "ביטול",
          bookAppointmentButton: "קבע תור"
        },
        days: {
          sun: "א",
          mon: "ב",
          tue: "ג",
          wed: "ד",
          thu: "ה",
          fri: "ו",
          sat: "ש"
        },
        months: {
          january: "ינואר",
          february: "פברואר",
          march: "מרץ",
          april: "אפריל",
          may: "מאי",
          june: "יוני",
          july: "יולי",
          august: "אוגוסט",
          september: "ספטמבר",
          october: "אוקטובר",
          november: "נובמבר",
          december: "דצמבר"
        },
        userDetails: {
          noUserLoggedIn: "❌ אין משתמש מחובר! מפנה לדף התחברות...",
          userEmailMissing: "❌ חסר אימייל משתמש!",
          userNotFound: "❌ המשתמש לא נמצא במערכת!",
          errorLoadingUser: "❌ שגיאה בטעינת המשתמש:",
          errorIdentifyingUser: "❌ שגיאה בזיהוי המשתמש!",
          userLoggedOut: "🚪 המשתמש התנתק.",
          loadingData: "טוען נתונים...",
          noUserDataFound: "❌ לא נמצאו נתוני משתמש."
        },
        facilityStatus: {
          errorLoadingStatus: "❌ שגיאה בטעינת הסטטוס:"
        },
        forgotPassword: {
          pleaseEnterEmail: "אנא הכנס את כתובת המייל שלך",
          pleaseEnterValidEmail: "אנא הכנס כתובת מייל תקינה",
          resetEmailSentSuccess: "מייל איפוס סיסמה נשלח בהצלחה! אנא בדוק את המייל שלך ועקוב אחר ההוראות.",
          errorSendingResetEmail: "שגיאה בשליחת מייל איפוס. אנא נסה שוב.",
          forgotPassword: "שכחתי סיסמה",
          enterEmailForReset: "הכנס את כתובת המייל שלך ונשלח לך קישור לאיפוס הסיסמה.",
          emailAddress: "כתובת מייל",
          sendResetEmail: "שלח מייל איפוס",
          backToLogin: "חזור להתחברות"
        },
        userManagement: {
          manager: "מנהל",
          regularUser: "משתמש רגיל",
          therapist: "מטפל",
          patient: "מטופל",
          allRequiredFieldsMustBeFilled: "כל השדות החובה צריכים להיות מלאים",
          invalidEmailFormat: "פורמט אימייל לא תקין",
          usernameCannotBeEmptyOrContainSpaces: "שם משתמש לא יכול להיות ריק או להכיל רווחים",
          birthDateCannotBeInFuture: "תאריך לידה לא יכול להיות בעתיד",
          userMustBeAtLeastOneYearOld: "המשתמש חייב להיות לפחות בן שנה אחת",
          userCannotBeOlderThan120Years: "המשתמש לא יכול להיות בן יותר מ-120 שנה",
          invalidPhoneFormat: "פורמט טלפון לא תקין",
          poolIdMustBeNumber: "מזהה בריכה חייב להיות מספר",
          firstNameAndLastNameCanOnlyContainHebrewOrEnglishLetters: "שם פרטי ושם משפחה יכולים להכיל רק אותיות בעברית או באנגלית",
          firstNameMustBeBetween2And50Characters: "שם פרטי חייב להיות בין 2 ל-50 תווים",
          lastNameMustBeBetween2And50Characters: "שם משפחה חייב להיות בין 2 ל-50 תווים",
          usernameMustBeBetween3And30Characters: "שם משתמש חייב להיות בין 3 ל-30 תווים",
          emailCannotBeLongerThan100Characters: "אימייל לא יכול להיות ארוך מ-100 תווים",
          phoneCannotBeLongerThan20Characters: "מספר טלפון לא יכול להיות ארוך מ-20 תווים",
          poolIdCannotBeLongerThan10Digits: "מזהה בריכה לא יכול להיות ארוך מ-10 ספרות",
          therapyPoolCannotBeLongerThan50Characters: "בריכת טיפול לא יכולה להיות ארוכה מ-50 תווים",
          cannotIdentifyUser: "לא ניתן לזהות את המשתמש",
          userUpdatedSuccessfully: "✅ המשתמש עודכן בהצלחה!",
          errorUpdatingUser: "שגיאה בעדכון המשתמש",
          editUser: "עריכת משתמש:",
          personalDetails: "פרטים אישיים",
          firstName: "שם פרטי",
          lastName: "שם משפחה",
          email: "אימייל",
          username: "שם משתמש",
          phone: "טלפון",
          dateOfBirth: "תאריך לידה",
          gender: "מין",
          male: "זכר",
          female: "נקבה",
          role: "תפקיד",
          poolDetails: "פרטי בריכה",
          poolId: "מזהה בריכה",
          therapyPool: "בריכת טיפול",
          accessibilitySettings: "הגדרות נגישות",
          language: "שפה",
          hebrew: "עברית",
          english: "English",
          textSize: "גודל טקסט",
          small: "קטן",
          medium: "בינוני",
          large: "גדול",
          accessibility: "נגישות",
          active: "פעיל",
          inactive: "לא פעיל",
          highContrast: "ניגודיות גבוהה",
          cancel: "ביטול",
          updating: "מעדכן...",
          updateUser: "עדכן משתמש"
        },
        payments: {
          paymentSystemTitle: "מערכת תשלומים",
          newPayment: "תשלום חדש",
          poolPayments: "תשלומי בריכה",
          paymentHistory: "היסטוריית תשלומים",
          myPayments: "התשלומים שלי",
          adminView: "👨‍💼 תצוגת מנהל",
          showingAllPayments: "מציג את כל התשלומים מהמשתמשים בבריכה שלך",
          noPaymentsToShow: "אין תשלומים להצגה",
          date: "תאריך",
          amount: "סכום",
          paymentMethod: "אמצעי תשלום",
          status: "סטטוס",
          dateLocale: "he-IL",
          paid: "שולם",
          pending: "ממתין"
        },
        personalSensors: {
          title: "חיישנים אישיים",
          subtitle: "בדוק את מצב החיישנים האישיים שלך",
          showAll: "הצג הכל",
          info: {
            title: "מידע על החיישנים",
            waterTemp: "חיישן טמפרטורת מים בבריכה - בודק את הטמפרטורה האופטימלית לפעילות בבריכה",
            chlorine: "חיישן רמת כלור - מבטיח רמה בטוחה של כלור במים",
            acidity: "חיישן רמת חומציות - בודק את רמת ה-pH במים",
            showerTemp: "חיישן טמפרטורת מים במקלחות - מבטיח טמפרטורה נוחה במקלחות",
            general: "מידע כללי על החיישנים"
          },
          waterTemp: {
            title: "חיישן טמפרטורת מים",
            subtitle: "בדיקת טמפרטורת המים בבריכה",
            infoTitle: "מידע על חיישן טמפרטורת מים",
            info: "חיישן טמפרטורת מים בבריכה - בודק את הטמפרטורה האופטימלית לפעילות בבריכה. הטמפרטורה האופטימלית לפעילות בבריכה היא בין 26-30 מעלות צלזיוס."
          },
          chlorine: {
            title: "חיישן רמת כלור",
            subtitle: "בדיקת רמת הכלור במים",
            infoTitle: "מידע על חיישן רמת כלור",
            info: "חיישן רמת כלור - מבטיח רמה בטוחה של כלור במים. הרמה האופטימלית לכלור במים היא בין 1-3 ppm. רמה גבוהה מדי עלולה לגרום לגירוי בעור."
          },
          acidity: {
            title: "חיישן רמת חומציות",
            subtitle: "בדיקת רמת החומציות במים",
            infoTitle: "מידע על חיישן רמת חומציות",
            info: "חיישן רמת חומציות - בודק את רמת ה-pH במים. הרמה האופטימלית ל-pH במים היא בין 7.2-7.6. רמה נמוכה מדי עלולה לגרום לקורוזיה."
          },
          showerTemp: {
            title: "חיישן טמפרטורת מקלחת",
            subtitle: "בדיקת טמפרטורת המים במקלחות",
            infoTitle: "מידע על חיישן טמפרטורת מקלחת",
            info: "חיישן טמפרטורת מים במקלחות - מבטיח טמפרטורה נוחה במקלחות. הטמפרטורה האופטימלית היא בין 35-40 מעלות צלזיוס."
          }
        },
        reminders: {
          title: "שולח תזכורות",
          actions: "פעולות",
          sendReminders: "שלח תזכורות",
          sending: "שולח...",
          refreshList: "רענן רשימה",
          tomorrowAppointments: "תורים למחר ({count})",
          noAppointmentsTomorrow: "אין תורים למחר",
          sentSuccessfully: "✅ {count} תזכורות נשלחו בהצלחה!",
          lastSent: "נשלחו לאחרונה: {count} תזכורות",
          errorLoadingAppointments: "שגיאה בטעינת התורים",
          errorSending: "❌ שגיאה בשליחת תזכורות",
          appointmentType: "תור: {type}",
          viewDetails: "צפה בפרטים",
          noUserData: "לא נמצאו נתוני משתמש",
          noPoolId: "לא נמצא מזהה בריכה למשתמש",
          sendTelegram: "שלח טלגרם",
          sendEmail: "שלח מייל",
          sendBoth: "שלח שניהם",
          telegramSentSuccess: "תזכורת טלגרם נשלחה בהצלחה",
          telegramError: "שגיאה בשליחת תזכורת טלגרם",
          emailSentSuccess: "✅ {count} תזכורות מייל נשלחו בהצלחה!",
          emailError: "שגיאה בשליחת תזכורות מייל",
          bothSentSuccess: "✅ {count} תזכורות נשלחו במייל ובטלגרם!",
          genericError: "שגיאה בשליחת תזכורות",
          telegramHeader: "תזכורת תורים למחר",
          telegramFooter: "אנא בדוק את התורים שלך למחר",
          appointments: "תורים",
          date: "תאריך",
          emailCount: "מיילים נשלחו: {count}",
          id: "מזהה",
          customers: "לקוחות"
        },
        presence: {
          inPool: "📍 אני בבריכה",
          notInPool: "🏠 איני בבריכה",
          arrivedAtPool: "הגעה לבריכה",
          leftPool: "יציאה מהבריכה",
          userArrived: "המשתמש הגיע",
          userLeft: "המשתמש יצא"
        }
      }
    };

    this.translations[language] = fallbackTranslations[language];
    
    // Dispatch event when fallback translations are ready
    window.dispatchEvent(new CustomEvent('translationsReady'));
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Set current language and load translations
   */
  async setLanguage(language: Language): Promise<void> {
    if (this.currentLanguage === language) {
      return;
    }

    this.currentLanguage = language;
    localStorage.setItem('selectedLanguage', language);
    
    // Load fallback translations immediately
    this.loadFallbackTranslations(language);
    
    // Dispatch language change event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  }

  /**
   * Get translation by key path (e.g., "navigation.home")
   */
  t(keyPath: string, fallback?: string): string {
    const keys = keyPath.split('.');
    let value: any = this.translations[this.currentLanguage];
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Only log missing translations in development
        if (process.env.NODE_ENV === 'development') {
          console.warn(`⚠️ Missing translation key: ${keyPath} for language: ${this.currentLanguage}`);
        }
        return fallback || keyPath;
      }
    }
    
    // If value is an object (like nested translations), return the key path
    if (typeof value === 'object' && value !== null) {
      return fallback || keyPath;
    }
    
    const result = typeof value === 'string' ? value : (fallback || keyPath);
    return result;
  }

  /**
   * Get translation with parameters
   */
  tp(keyPath: string, params: Record<string, string | number>, fallback?: string): string {
    let translation = this.t(keyPath, fallback);
    
    // Replace parameters in translation
    Object.entries(params).forEach(([key, value]) => {
      translation = translation.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    });
    
    return translation;
  }

  /**
   * Get namespace translations
   */
  getNamespace(namespace: string): TranslationDictionary {
    return this.translations[this.currentLanguage][namespace] || {};
  }

  /**
   * Check if current language is RTL
   */
  isRTL(): boolean {
    return this.currentLanguage === 'he';
  }

  /**
   * Get text direction
   */
  getDirection(): 'ltr' | 'rtl' {
    return this.isRTL() ? 'rtl' : 'ltr';
  }

  /**
   * Get language display name
   */
  getLanguageDisplayName(language?: Language): string {
    const lang = language || this.currentLanguage;
    const names: Record<Language, string> = {
      en: 'English',
      he: 'עברית'
    };
    return names[lang];
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'he', name: 'Hebrew', nativeName: 'עברית' }
    ];
  }

  /**
   * Reload translations from server (useful for dynamic updates)
   */
  async reloadTranslations(): Promise<void> {
    console.log("🔄 Reloading translations for language:", this.currentLanguage);
    
    // Clear current translations
    this.translations[this.currentLanguage] = {};
    
    // Load fallback translations immediately
    this.loadFallbackTranslations(this.currentLanguage);
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('translationsReady'));
    
    console.log("✅ Translations reloaded successfully");
  }

  /**
   * Clear cache and reload translations
   */
  async clearCacheAndReload(): Promise<void> {
    // Clear localStorage
    localStorage.removeItem('selectedLanguage');
    
    // Clear all translations
    this.translations = {};
    
    // Reset current language to default
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) {
      this.currentLanguage = 'en';
    } else {
      this.currentLanguage = 'he';
    }
    
    // Load fallback translations
    this.loadFallbackTranslations(this.currentLanguage);
    
    // Dispatch events
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: this.currentLanguage }));
    window.dispatchEvent(new CustomEvent('translationsReady'));
  }

  /**
   * Load specific namespace from server
   */
  async loadNamespace(namespace: string): Promise<TranslationDictionary> {
    try {
      const response = await fetch(`${this.baseUrl}/lang/${this.currentLanguage}/${namespace}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load namespace: ${response.status}`);
      }

      const namespaceTranslations = await response.json();
      
      // Merge with existing translations
      if (!this.translations[this.currentLanguage]) {
        this.translations[this.currentLanguage] = {};
      }
      this.translations[this.currentLanguage][namespace] = namespaceTranslations;
      
      return namespaceTranslations;
    } catch (error) {
      console.error(`❌ Error loading namespace ${namespace}:`, error);
      return {};
    }
  }

  /**
   * Check if translations are loaded
   */
  isReady(): boolean {
    return true; // Always ready since we load fallback translations immediately
  }

  /**
   * Format date according to current language
   */
  formatDate(date: Date): string {
    const locale = this.currentLanguage === 'he' ? 'he-IL' : 'en-US';
    return date.toLocaleDateString(locale);
  }

  /**
   * Format number according to current language
   */
  formatNumber(number: number): string {
    const locale = this.currentLanguage === 'he' ? 'he-IL' : 'en-US';
    return number.toLocaleString(locale);
  }

  /**
   * Format currency according to current language
   */
  formatCurrency(amount: number): string {
    const locale = this.currentLanguage === 'he' ? 'he-IL' : 'en-US';
    const currency = this.currentLanguage === 'he' ? 'ILS' : 'USD';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}

// Create singleton instance
const translationService = new TranslationService();

// Export convenience functions
export const t = (keyPath: string, fallback?: string) => translationService.t(keyPath, fallback);
export const tp = (keyPath: string, params: Record<string, string | number>, fallback?: string) => 
  translationService.tp(keyPath, params, fallback);
export const getCurrentLanguage = () => translationService.getCurrentLanguage();
export const setLanguage = (language: Language) => translationService.setLanguage(language);
export const isRTL = () => translationService.isRTL();
export const getDirection = () => translationService.getDirection();
export const reloadTranslations = () => translationService.reloadTranslations();

export default translationService; 