"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Editor } from "@/components/editor/Editor";

// 1. ScrollArea의 부모 컨테이너가 명확한 크기를 가져야 합니다.
export default function Edit() {
  return (
    // flex와 함께 사용하여 남은 공간을 모두 차지하도록 설정
    <div className="flex flex-col h-full">
      {/* ScrollArea는 flex-1을 통해 남은 공간을 모두 사용 */}
      <ScrollArea className="flex-1 rounded-lg border">
        <div className="p-4">
          <h1>This is edit Page. Let&#39;s check the layout.</h1>
          <div className="mt-4">
            <Editor />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
