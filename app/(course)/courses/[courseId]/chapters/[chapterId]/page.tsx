import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import Banner from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import CourseEnrollButton from "./_components/course-enroll-button";
import VideoPlayer from "./_components/video-player";

import { getChapter } from "@/actions/get-chapter";
import CourseProgressButton from "./_components/course-progress-button";

interface ChapterIdPageProps {
    params: {
        courseId: string;
        chapterId: string;
    }
}

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter,
        course,
        attachments,
        muxData,
        nextChapter,
        userProgress,
        purchase
    } = await getChapter({
        userId,
        courseId: params.courseId,
        chapterId: params.chapterId
    });

    if (!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                  label="You already completed this chapter."
                  variant="success"
                />
            )}
            {isLocked && (
                <Banner
                  label="You need to purchase this course to watch this chapter."
                  variant="warning"
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                      courseId={params.courseId}
                      chapterId={params.chapterId}
                      nextChapterId={nextChapter?.id}
                      playbackId={muxData?.playbackId!}
                      title={chapter.title}
                      isLocked={isLocked}
                      completeOnEnd={completeOnEnd}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2">
                            {chapter.title}
                        </h2>
                        {purchase ? (
                            <CourseProgressButton
                              courseId={params.courseId}
                              chapterId={params.chapterId}
                              nextChapterId={nextChapter?.id!}
                              isCompleted={!!userProgress?.isCompleted}
                            />
                        ): (
                            <CourseEnrollButton
                              courseId={params.courseId}
                              price={course.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description!} />
                    </div>
                    {!!attachments.length && (
                        <>
                          <Separator />
                          <div className="p-4">
                            {attachments.map((attachment) => (
                                <a
                                  key={attachment.id}
                                  href={attachment.url}
                                  target="_blank"
                                  className="flex items-center p-3 w-full gap-x-2 bg-blue-200 border text-blue-700 rounded-md hover:underline"
                                >
                                    <File />
                                    <p className="line-clamp-1">
                                        {attachment.name}
                                    </p>
                                </a>
                            ))}
                          </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
 
export default ChapterIdPage;