# Design Guidelines for Job Matching Platform

## Color Palette (Strictly Enforced)

**Primary Color:** `#6C63FF` (Soft Indigo) - Use for primary buttons, links, active states, and key accents
**Secondary Color:** `#4ECDC4` (Calm Aqua) - Use for secondary buttons, hover states, and complementary accents  
**Background:** `#F7F9FC` (Soft Off-White) - Main page background for optimal readability
**Text Color:** `#1A1A1A` - All body text and headings

Configure these exact colors in your TailwindCSS theme config and use them consistently throughout.

## Navbar Design

**Style:** Modern, minimal, sticky glassmorphism
- Blurred background with backdrop-filter blur effect
- Semi-transparent background using the primary/secondary palette
- Responsive with hamburger menu on mobile
- Sticky positioning (stays at top on scroll)
- Clean typography with proper spacing

## Hero Section (Home Page)

**Layout:** Full-width gradient background
- Use gradient combining primary (#6C63FF) and secondary (#4ECDC4) colors
- Center-aligned content with large, bold typography
- Two prominent CTA buttons: "Login" and "Register"
- Buttons on gradient background MUST have blurred/frosted glass backgrounds
- Minimal iconography integrated tastefully
- Responsive scaling for mobile devices

## Form Pages (Login/Register)

**Design Pattern:** Card-centered layout
- Forms displayed in elevated cards with subtle shadows
- Center-aligned on page with comfortable max-width
- Input fields with clear labels and validation states
- Primary button using #6C63FF, hover states with secondary color
- Clean spacing between form elements
- Error messages in red, success states in green

## Dashboard Page

**Layout:** Grid-based stats overview
- Display user name prominently at top
- Stats cards showing: Skill count, Job matches count
- Quick action buttons section (Add Skills, View Jobs)
- Card-based design with consistent spacing
- Use soft shadows and rounded corners

## Jobs Pages

**Jobs List (/jobs):** Card grid layout
- Job cards with title, company, description preview, required skills tags
- Responsive grid: 1 column mobile, 2-3 columns desktop
- Hover effects with subtle elevation change

**Job Details (/jobs/[id]):** Single-column detailed view
- Full job description
- Skills tags prominently displayed
- Apply/Save buttons with primary color
- Related jobs section at bottom

## Matching Page

**Layout:** Recommendation cards with match indicators
- Display match percentage/score visually
- Highlight matched skills with tags using secondary color
- Clear visual hierarchy showing best matches first
- Filter/sort options at top

## Skills Page

**Layout:** Two-section design
- Form section for adding/updating skills
- Display section showing existing skills as removable tags
- Tags use combination of primary and secondary colors
- Smooth animations when adding/removing skills

## Component Library (ShadCN UI)

Use ShadCN UI for all base components, customized with theme colors:
- **Buttons:** Primary (#6C63FF), Secondary (#4ECDC4), outline variants
- **Inputs:** Clean borders, focus states using primary color
- **Cards:** Subtle shadows, rounded corners, white backgrounds
- **Tags/Badges:** Pill-shaped with primary/secondary backgrounds

## Animation & Interactions

**Framer Motion Integration:**
- Page transitions: Subtle fade-in effects
- Card hover: Slight elevation increase (translateY)
- Button clicks: Scale effect (0.95)
- Form validation: Shake animation on error
- Keep animations subtle and performant

## Responsive Design

**Mobile-First Approach:**
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Stack layouts vertically on mobile
- Hamburger menu for mobile navigation
- Touch-friendly button sizes (min 44px height)
- Readable font sizes on all devices

## Dark Mode Support

Implement dark mode toggle with smooth transitions:
- Dark background: `#1A1A2E`
- Dark surface: `#252A42`
- Adjust text colors for readability
- Maintain primary/secondary color accent visibility

## Typography

- **Headings:** Bold, clear hierarchy (text-3xl, text-2xl, text-xl)
- **Body:** Readable line height (1.6-1.8)
- **Buttons/Labels:** Medium weight, uppercase for emphasis where appropriate
- Use system fonts or Google Fonts for performance

## Spacing System

Use TailwindCSS spacing scale consistently:
- **Sections:** py-12 to py-20
- **Cards:** p-6 to p-8
- **Form elements:** gap-4 to gap-6
- **Margins:** mb-4, mb-6, mb-8 for vertical rhythm