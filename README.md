# CivicGuard

## AI-Powered Community Infrastructure Guardian

An intelligent multi-agent system that helps citizens report civic infrastructure issues while automatically analyzing, prioritizing, routing, and tracking complaints using AI.

---

## Problem Statement

Cities receive thousands of civic complaints every day, but many are delayed because of:

- Manual categorization
- Incorrect department assignment
- No priority analysis
- Lack of complaint tracking
- Poor communication between citizens and authorities

CivicGuard addresses these challenges using AI agents that automate the complete complaint lifecycle.

---

## Features

### Smart Complaint Reporting

- Camera Capture
- Gallery Upload
- GPS Location Detection
- Interactive India Map
- Manual Location Selection
- Optional Problem Description

### AI Vision Agent

Automatically detects:

- Potholes
- Garbage Overflow
- Broken Streetlights
- Water Leakage
- Road Damage
- Fallen Trees
- Traffic Signal Damage
- Open Manholes
- Electric Pole Damage
- Flooded Roads
- Broken Footpaths
- Other Infrastructure Issues

### AI Agents

- Vision Agent
- Location Agent
- Priority Agent
- Routing Agent
- Notification Agent
- Analytics Agent
- Verification Agent

### Dashboard

- Total Complaints
- Pending Cases
- Resolved Cases
- Critical Issues
- AI Insights
- Community Impact Score

### Complaint Tracking

Track every complaint through the following stages:

Registered

↓

Assigned

↓

In Progress

↓

Completed

↓

Citizen Verification

### Notifications

Receive notifications when:

- Complaint Registered
- Department Assigned
- Work Started
- Work Completed
- Verification Requested

### Citizen Verification

After a complaint is marked as completed, the citizen is asked:

"Has the issue been rectified?"

- Yes → Complaint Closed
- No → Complaint Reopened

---

## System Architecture

```text
Citizen
     │
     ▼
Upload Image
     │
     ▼
Vision Agent
     │
     ▼
Location Agent
     │
     ▼
Priority Agent
     │
     ▼
Department Routing Agent
     │
     ▼
Notification Agent
     │
     ▼
Complaint Registered
     │
     ▼
Complaint Tracking
     │
     ▼
Citizen Verification
```

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | React |
| Language | TypeScript |
| Styling | CSS |
| Maps | Leaflet + OpenStreetMap |
| AI | Google AI Studio |
| Location | Browser Geolocation API |
| Image Capture | MediaDevices API |

---

## Kaggle AI Agents Capstone Requirements

| Requirement | CivicGuard Implementation |
|-------------|---------------------------|
| Agent / Multi-Agent System | Vision Agent, Location Agent, Priority Agent, Routing Agent, Notification Agent, Verification Agent |
| Security Features | Secure handling of user inputs and no API keys stored in the repository |
| Deployability | React application deployable through GitHub |
| Agent Skills | Automated image analysis, prioritization, routing, notifications, and complaint tracking |

> If MCP Server or ADK are implemented in your project, add them to this table before submission.

---

## Project Structure

```text
CivicGuard/

├── Dashboard
├── Report Complaint
├── Track Complaint
├── Notifications
├── Analytics
├── AI Workflow
├── Components
├── Assets
├── Pages
├── README.md
```

---

## Installation

```bash
git clone https://github.com/yourusername/CivicGuard.git

cd CivicGuard

npm install

npm run dev
```

---


## Future Enhancements

- Government API Integration
- Real-Time Department Dashboard
- Offline Complaint Reporting
- Predictive Infrastructure Maintenance
- AI Duplicate Complaint Detection
- Smart Resource Allocation

---


Built as part of the Kaggle AI Agents Capstone Project.