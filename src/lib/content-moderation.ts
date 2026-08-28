/**
 * Client-side content moderation.
 * Provides a word filter and suggests clean alternatives.
 * This is the FIRST line of defense — backend moderation handled server-side.
 */

const FLAGGED_WORDS = [
    'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'crap', 'cock',
    'dick', 'pussy', 'whore', 'slut', 'piss', 'nigger', 'nigga', 'faggot',
    'retard', 'kill yourself', 'kys', 'rape',
];

export interface ModerationResult {
    flagged: boolean;
    word?: string;
    severity: 'clean' | 'mild' | 'severe';
    message?: string;
}

export function moderateContent(text: string): ModerationResult {
    const lower = text.toLowerCase();

    for (const word of FLAGGED_WORDS) {
        // Check as whole word or substring (for common spellings)
        const regex = new RegExp(`\\b${word.replace(/\s+/, '\\s+')}\\b`, 'i');
        if (regex.test(lower)) {
            const isSevere = ['rape', 'kill yourself', 'kys', 'nigger', 'nigga', 'faggot'].includes(word);
            return {
                flagged: true,
                word,
                severity: isSevere ? 'severe' : 'mild',
                message: isSevere
                    ? 'This content violates community rules and cannot be posted.'
                    : 'Please keep it respectful. This word may get your post removed.',
            };
        }
    }

    return { flagged: false, severity: 'clean' };
}

export interface SpaceRule {
    text: string;
}

export const SPACE_RULES: Record<string, { title: string; rules: SpaceRule[] }> = {
    general: {
        title: 'General Space Rules',
        rules: [
            { text: 'Be respectful to all members' },
            { text: 'No spam or repeated messages' },
            { text: 'Stay on topic — tech, learning, campus life' },
            { text: 'Credit sources when sharing content' },
            { text: 'No personal attacks or harassment' },
        ],
    },
    'ask-help': {
        title: 'Ask Help Rules',
        rules: [
            { text: 'Describe your problem clearly with details' },
            { text: 'Include code snippet or error message' },
            { text: 'Mark as Solved when your question is answered' },
            { text: 'Thank helpers — build a positive community' },
            { text: 'Search before asking — it may already be answered' },
        ],
    },
    showcase: {
        title: 'Showcase Rules',
        rules: [
            { text: 'Include a GitHub link or live demo' },
            { text: 'Add a screenshot or video of your project' },
            { text: 'Describe what your project does in the post' },
            { text: 'Engage with others\' showcases — give feedback' },
            { text: 'No incomplete or placeholder projects' },
        ],
    },
    opportunities: {
        title: 'Opportunities Rules',
        rules: [
            { text: 'Include deadline, compensation, and location' },
            { text: 'Only share verified, legitimate opportunities' },
            { text: 'No MLM schemes, pyramid schemes, or scams' },
            { text: 'Prefer student-friendly roles and internships' },
            { text: 'Include direct contact or application link' },
        ],
    },
    competitive: {
        title: 'Competitive Rules',
        rules: [
            { text: 'Share hackathon teams, results, and resources' },
            { text: 'Include event dates and registration links' },
            { text: 'Open to team-up requests — be inclusive' },
            { text: 'Share DSA, CP tips and problem solutions' },
            { text: 'No plagiarism — credit original problem authors' },
        ],
    },
};
