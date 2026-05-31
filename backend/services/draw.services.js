const pool = require("../db/pool")

class DrawService {
    async generateDraw(categoryId) {
        const participants = await this.getParticipants(categoryId);

        if (participants.length < 2) {
            throw new Error(
                "Minimum 2 participants required"
            );
        }

        return {
            totalParticipants: participants.length
        };
    }
    
    async getParticipants(categoryId) {
        const result =
            pool.query(
                `
        SELECT
        r.id as registration_id,
        r.seed,
        s.id as student_id,
        s.first_name,
        s.last_name,
        s.dojo_id,
        s.instructor_id
        FROM registrations r
        JOIN students s
        ON r.student_id = s.id
        WHERE r.category_id = $1
        AND r.approval_status = 'APPROVED'
        `,
                [categoryId]
            );

        return result.rows;
    }

}

module.exports = new DrawService();
