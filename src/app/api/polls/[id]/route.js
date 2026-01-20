export async function GET(request, { params }) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('X-CSRF-Token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const { id } = params;

    const userSecret = cookieStore.get('secretKey');

    if (!userSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const poll = await prisma.poll.findUnique({
        where: { id: Number(id) },
        include: {
            options: {
                include: {
                    votes: true
                }
            }
        }
    });

    if (!poll) {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }


    const pollWithVoteCounts = {
        ...poll,
        options: poll.options.map(option => ({
            ...option,
            voteCount: option.votes.length
        }))
    }

    return NextResponse.json(pollWithVoteCounts);
}