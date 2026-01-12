/**
 * SLA Background Monitor
 * 
 * Periodically checks all active leads and updates their SLA status.
 */

import { getLeads, updateLead, updateSLATracking } from './leads';
import { logger } from './logger';

let monitorInterval: number | null = null;
const CHECK_INTERVAL_MS = 15 * 60 * 1000; // Check every 15 minutes

/**
 * Perform SLA check on all active leads
 */
export function checkLeadsSLA(): void {
    try {
        const leads = getLeads();
        const activeLeads = leads.filter(l =>
            l.status !== 'converted' &&
            l.status !== 'archived' &&
            l.status !== 'lost'
        );

        if (activeLeads.length === 0) return;

        logger.info(`SLA Monitor: Checking ${activeLeads.length} active leads`);

        let updatedCount = 0;

        activeLeads.forEach(lead => {
            const newSla = updateSLATracking(lead);

            // Only update if compliance or overdue time changed
            if (
                newSla.slaCompliant !== lead.sla.slaCompliant ||
                Math.abs((newSla.overdueBy || 0) - (lead.sla.overdueBy || 0)) > 0.01
            ) {
                updateLead(lead.id, { sla: newSla });
                updatedCount++;
            }
        });

        if (updatedCount > 0) {
            logger.info(`SLA Monitor: Updated ${updatedCount} leads`);
        }
    } catch (error) {
        logger.error('SLA Monitor: Failed to check leads', error);
    }
}

/**
 * Start the background SLA monitor
 */
export function startSLABackgroundMonitor(): void {
    if (monitorInterval) {
        logger.warn('SLA Monitor: Monitor already running');
        return;
    }

    // Perform initial check
    checkLeadsSLA();

    // Set up interval
    monitorInterval = window.setInterval(checkLeadsSLA, CHECK_INTERVAL_MS);
    logger.info('SLA Monitor: Background monitoring started');
}

/**
 * Stop the background SLA monitor
 */
export function stopSLABackgroundMonitor(): void {
    if (monitorInterval) {
        window.clearInterval(monitorInterval);
        monitorInterval = null;
        logger.info('SLA Monitor: Background monitoring stopped');
    }
}
