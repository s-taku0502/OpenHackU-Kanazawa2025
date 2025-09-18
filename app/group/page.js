"use client";
import UserList from "@/components/UserList";
import FooterMenu from "@/components/FooterMenu";
import CreateGroupPage from "@/components/CreateGroupPage"
import JoinGroupPage from "@/components/JoinGroupPage";
import SearchResultPage from "@/components/SearchResultPage";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function GroupPage() {
  const [groupName, setGroupName] = useState("");
  const [joinGroupId, setJoinGroupId] = useState("");
  const [user, setUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [appliedGroupId, setAppliedGroupId] = useState("");
  // Corrected state variables
  const [joinMessage, setJoinMessage] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [searchedGroup, setSearchedGroup] = useState(null);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.applying_groupId) {
            setAppliedGroupId(userData.applying_groupId);
          }
          if (userData.groupIds) {
            const groupIds = userData.groupIds;
            const groupsData = await Promise.all(
              groupIds.map(async (id) => {
                const groupDocRef = doc(db, "groups", id);
                const groupDocSnap = await getDoc(groupDocRef);
                return groupDocSnap.exists()
                  ? { id: groupDocSnap.id, ...groupDocSnap.data() }
                  : null;
              })
            );
            setUserGroups(groupsData.filter((group) => group !== null));
          }
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleCreateGroup = async (newGroupName) => {
    if (!user || !newGroupName.trim()) {
      setCreateMessage("グループ名を入力してください。");
      return;
    }
    try {
      const groupDocRef = await addDoc(collection(db, "groups"), {
        name: newGroupName,
        memberUids: [user.uid],
      });
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        groupIds: arrayUnion(groupDocRef.id),
        applying_groupId: groupDocRef.id,
      });
      setCreateMessage("");

      const newUserGroups = userGroups
        .filter((group) => group.id !== groupDocRef.id)
        .concat({ id: groupDocRef.id, name: newGroupName });

      setUserGroups(newUserGroups);
      setAppliedGroupId(groupDocRef.id);
      setCurrentPage("groupList");
    } catch (error) {
      console.error("グループ作成エラー:", error);
      // Corrected setter here
      setCreateMessage("グループの作成に失敗しました: ${error.message}");
    }
  };

  const handleSearchGroup = async (searchId) => {
    try {
      const groupDocRef = doc(db, "groups", searchId);
      const groupDocSnap = await getDoc(groupDocRef);

      if (groupDocSnap.exists()) {
        const groupData = { id: groupDocSnap.id, ...groupDocSnap.data() };
        setSearchedGroup(groupData);
        setCurrentPage("searchResult");
      } else {
        // Corrected setter here
        setJoinMessage("指定されたグループは存在しません。");
        setSearchedGroup(null);
      }
    } catch (error) {
      console.error("グループ検索エラー:", error);
      // Corrected setter here
      setJoinMessage("グループの検索に失敗しました: ${error.message}");
      setSearchedGroup(null);
    }
  };

  const handleJoinGroup = async (groupId) => {
    if (!user) {
      // Corrected setter here
      setJoinMessage("ログインしてください。");
      return;
    }

    // Corrected getter here
    if (userGroups.some(group => group.id === groupId)) {
      // Corrected setter here
      setJoinMessage("このグループにはすでに参加済みです。");
      setSearchedGroup(null);
      return;
    }

    try {
      const groupDocRef = doc(db, "groups", groupId);
      await updateDoc(groupDocRef, {
        memberUids: arrayUnion(user.uid),
      });
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        groupIds: arrayUnion(groupId),
        applying_groupId: groupId,
      });
      const newGroupData = await getDoc(groupDocRef);
      if (newGroupData.exists()) {
        const newUserGroups = userGroups
          .filter((group) => group.id !== groupId)
          .concat({ id: groupId, ...newGroupData.data() });
        setUserGroups(newUserGroups);
      }
      setAppliedGroupId(groupId);
      setSearchedGroup(null);
      setCurrentPage("groupList");
    } catch (error) {
      console.error("グループ参加エラー:", error);
      // Corrected setter here
      setJoinMessage("グループへの参加に失敗しました: ${error.message}");
    }
  };

  const handleApplyGroup = async (groupId) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        applying_groupId: groupId,
      });
      setAppliedGroupId(groupId);
      // Corrected setter here
      setJoinMessage("");
    } catch (error) {
      console.error("グループ適用エラー:", error);
      // Corrected setter here
      setJoinMessage("グループの適用に失敗しました: ${error.message}");
    }
  };
  const [currentPage, setCurrentPage] = useState("groupList");

  const handleCreateClick = () => {
    setCurrentPage("createGroup");
  };

  const handleJoinClick = () => {
    setCurrentPage("joinGroup");
  };

  const handleBackClick = () => {
    setCurrentPage("groupList");
    setSearchedGroup(null);
    // Corrected setters
    setJoinMessage("");
    setCreateMessage("");
  };

  if (currentPage === "createGroup") {
    return <CreateGroupPage onBack={handleBackClick} onCreateGroup={handleCreateGroup} message={createMessage} setMessage={setCreateMessage} />;
  }

  if (currentPage === "joinGroup") {
    // Corrected props
    return <JoinGroupPage onBack={handleBackClick} onSearch={handleSearchGroup} message={joinMessage} setMessage={setJoinMessage} />;
  }

  if (currentPage === "searchResult") {
    // Corrected props
    return <SearchResultPage group={searchedGroup} onBack={handleBackClick} onJoin={handleJoinGroup} message={joinMessage} setMessage={setJoinMessage} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <main className="p-4">
        <UserList users={userGroups.map(group => ({
          id: group.id,
          name: group.name,
        }))}
          appliedGroupId={appliedGroupId}
          onApplyGroup={handleApplyGroup}
        />
      </main>

      <FooterMenu
        onCreateClick={handleCreateClick}
        onJoinClick={handleJoinClick}
      />
    </div>
  );
}